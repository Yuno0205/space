"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle, Mic, RefreshCw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SharedProgressCard } from "@/components/shared/Progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { PronunciationResultState } from "@/types/pronunciation";
import { VocabularyCard } from "@/types/vocabulary";
import { qualifyVocabSkill } from "@/utils/Supabase/action";
import { analyzeSpeech, createNeutralWordDisplay } from "@/utils/pronunciation";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface SpeakingPracticeProps {
  cards?: VocabularyCard[];
}

interface SpeakingQuestionProps {
  card: VocabularyCard;
  onNext: () => void;
  currentPosition: number;
  totalCards: number;
}

export const initialPronunciationResultState: PronunciationResultState = {
  wordsForDisplay: [],
  transcript: "",
  overallScore: null,
  detailScores: null,
  error: null,
  isListening: false,
};

function SpeakingQuestion({ card, onNext, currentPosition, totalCards }: SpeakingQuestionProps) {
  const [showDefinition, setShowDefinition] = useState(false);
  const [isPronunciationQualified, setIsPronunciationQualified] = useState(false);
  const [isQualifying, setIsQualifying] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResultState>(() => ({
    ...initialPronunciationResultState,
    wordsForDisplay: createNeutralWordDisplay(card.word),
  }));

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { playAudio, isPlaying, stopAudio } = useSpeechSynthesis();

  const analyzePronunciation = (spokenText: string, confidence: number) => {
    const result = analyzeSpeech(card.word, spokenText, confidence);

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: spokenText,
      overallScore: result.overallScore,
      detailScores: result.details,
      wordsForDisplay: result.wordsForDisplay,
    }));
  };

  const resetCurrentAttempt = () => {
    stopAudio();

    recognitionRef.current?.abort();

    setPronunciationResult({
      ...initialPronunciationResultState,
      wordsForDisplay: createNeutralWordDisplay(card.word),
    });

    setShowDefinition(false);
  };

  const startListening = () => {
    if (pronunciationResult.isListening) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setPronunciationResult((prev) => ({
        ...prev,
        error: "Your browser does not support the Web Speech API. Please try Chrome or Edge.",
      }));

      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-GB";

      recognition.onstart = () => {
        setPronunciationResult((prev) => ({
          ...prev,
          isListening: true,
          error: null,
        }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const bestAlternative = event.results[0][0];

        const spokenText = bestAlternative.transcript.trim();

        analyzePronunciation(spokenText, bestAlternative.confidence);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorText = `Speech recognition error: ${event.error}`;

        if (event.error === "no-speech") {
          errorText = "No speech detected. Please try again.";
        } else if (event.error === "audio-capture") {
          errorText = "Microphone not found. Please check your device.";
        } else if (event.error === "not-allowed") {
          errorText = "Microphone access denied. Please grant permission.";
        }

        setPronunciationResult((prev) => ({
          ...prev,
          isListening: false,
          error: errorText,
        }));
      };

      recognition.onend = () => {
        setPronunciationResult((prev) => ({
          ...prev,
          isListening: false,
        }));
      };

      recognitionRef.current = recognition;
    }

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: "",
      overallScore: null,
      detailScores: null,
      wordsForDisplay: createNeutralWordDisplay(card.word),
      error: null,
    }));

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && pronunciationResult.isListening) {
      recognitionRef.current.stop();
    }
  };

  const handlePronunciationQualified = async () => {
    if (
      pronunciationResult.overallScore === null ||
      pronunciationResult.overallScore < 85 ||
      isPronunciationQualified ||
      isQualifying
    ) {
      return;
    }

    setIsQualifying(true);

    try {
      // 1. Qualify pronunciation + mastery +1
      await qualifyVocabSkill(card.id, "speaking");

      setIsPronunciationQualified(true);
    } catch (error) {
      console.error("Error qualifying pronunciation:", error);

      setPronunciationResult((prev) => ({
        ...prev,
        error: "Failed to save pronunciation progress.",
      }));
    } finally {
      setIsQualifying(false);
    }
  };

  const toggleDefinition = () => setShowDefinition((prev) => !prev);

  const getFeedbackMessage = (score: number | null): string => {
    if (score === null) return "Press the microphone to start.";
    if (score >= 90) return "Excellent! Your pronunciation is very accurate.";
    if (score >= 80) return "Very good! Your pronunciation is quite accurate.";
    if (score >= 70) return "Good! Your pronunciation is mostly correct.";
    if (score >= 60) return "Pretty good. Keep practicing!";
    if (score >= 50) return "Needs improvement. Listen and try again.";
    return "Listen to the correct pronunciation and try again.";
  };

  const getScoreColor = (score: number | null): string => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div>
      {pronunciationResult.error && (
        <Alert
          variant="destructive"
          className="bg-red-100 border-red-300 text-red-800 dark:bg-red-800 dark:border-red-600 dark:text-red-300"
        >
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          <AlertDescription>{pronunciationResult.error}</AlertDescription>
        </Alert>
      )}

      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-xl dark:bg-black"
      >
        <Card className="border-gray-300 bg-white dark:border-gray-700 dark:bg-white/5">
          <CardHeader className="border-b border-gray-300 dark:border-gray-700">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="mr-2 h-5 w-5" />
                Speaking Practice
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400 hidden sm:block">
                {currentPosition + 1}/{totalCards}
              </div>
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Press the microphone button and read the vocabulary below.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="relative flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 min-h-[3em]">
                  {pronunciationResult.wordsForDisplay.map((wordData, index) => (
                    <span
                      key={index}
                      className={cn(
                        wordData.color,
                        "text-3xl md:text-4xl font-bold dark:text-white text-gray-800"
                      )}
                    >
                      {wordData.text}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {card.phonetic && (
                    <p className="dark:text-gray-400 text-gray-500 text-lg">{card.phonetic}</p>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full dark:hover:bg-gray-700 hover:bg-gray-200"
                    onClick={() =>
                      playAudio({
                        audioUrl: card.audio_url,
                        text: card.word,
                        lang: "en-GB",
                      })
                    }
                    disabled={isPlaying}
                    title="Listen to pronunciation"
                    aria-label={isPlaying ? "Playing audio..." : "Listen to pronunciation"}
                  >
                    <Volume2 className="h-5 w-5" />
                    <span className="sr-only">Play audio</span>
                  </Button>
                </div>
                {card.word_type && (
                  <Badge
                    variant="outline"
                    className="mt-3 bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {card.word_type}
                  </Badge>
                )}
              </div>

              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    pronunciationResult.isListening
                      ? {
                          scale: [1, 1.15, 1],
                          transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
                        }
                      : {}
                  }
                >
                  <Button
                    size="lg"
                    className={cn(
                      "rounded-full h-20 w-20 flex items-center justify-center shadow-lg",
                      pronunciationResult.isListening
                        ? "bg-red-600 hover:bg-red-700 animate-pulse"
                        : "dark:bg-white bg-gray-800 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200"
                    )}
                    onClick={pronunciationResult.isListening ? stopListening : startListening}
                    title={pronunciationResult.isListening ? "Stop recording" : "Start recording"}
                    aria-label={
                      pronunciationResult.isListening ? "Stop recording" : "Start recording"
                    }
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                </motion.div>
              </div>

              {pronunciationResult.transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md p-4 bg-gray-100 dark:bg-gray-700/30 rounded-lg shadow border border-gray-300 dark:border-gray-700"
                >
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                      You said:
                    </p>
                    <p className="text-xl italic text-gray-700 dark:text-gray-200">
                      &quot;{pronunciationResult.transcript}&quot;
                    </p>
                  </div>

                  {pronunciationResult.overallScore !== null &&
                    pronunciationResult.detailScores && (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-800 dark:text-gray-300">
                              Overall Pronunciation Score:
                            </h4>
                            <span
                              className={cn(
                                "text-3xl font-bold",
                                getScoreColor(pronunciationResult.overallScore)
                              )}
                            >
                              {pronunciationResult.overallScore}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-center mb-4 text-sm",
                              getScoreColor(pronunciationResult.overallScore)
                            )}
                          >
                            {getFeedbackMessage(pronunciationResult.overallScore)}
                          </p>

                          <div className="space-y-3 mb-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Accuracy:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.accuracy
                                  )}
                                >
                                  {pronunciationResult.detailScores.accuracy}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.accuracy}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-sky-500"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Pronunciation:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.pronunciation
                                  )}
                                >
                                  {pronunciationResult.detailScores.pronunciation}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.pronunciation}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-teal-500"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Confidence:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.confidence
                                  )}
                                >
                                  {pronunciationResult.detailScores.confidence}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.confidence}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-indigo-500"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Completeness:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.completeness
                                  )}
                                >
                                  {pronunciationResult.detailScores.completeness}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.completeness}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-purple-500"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-center mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetCurrentAttempt}
                              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={toggleDefinition}
                              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {showDefinition ? "Hide Definition" : "Show Definition"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePronunciationQualified()}
                              className={cn(
                                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-150 ease-in-out",
                                isPronunciationQualified
                                  ? "bg-green-100 text-green-700 border-green-500 dark:bg-green-800/30 dark:text-green-400 dark:border-green-600 cursor-default"
                                  : pronunciationResult.overallScore !== null &&
                                      pronunciationResult.overallScore >= 85
                                    ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border-blue-500 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                    : "text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                              )}
                              title={
                                isPronunciationQualified
                                  ? "Marked as mastered for this attempt"
                                  : pronunciationResult.overallScore !== null &&
                                      pronunciationResult.overallScore >= 85
                                    ? "Mark this word as proficiently pronounced"
                                    : "Score 85 or above to mark as mastered"
                              }
                              disabled={
                                pronunciationResult.overallScore === null ||
                                pronunciationResult.overallScore < 85 ||
                                isPronunciationQualified
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {isPronunciationQualified ? "Marked as Mastered" : "Mark as Mastered"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                </motion.div>
              )}

              {showDefinition && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="w-full max-w-md border border-gray-300 dark:border-gray-700 rounded-lg p-4 mt-2 bg-gray-50 dark:bg-gray-700/30 shadow"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1 text-gray-800 dark:text-gray-200">
                        Definition:
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">{card.definition}</p>
                      {card.translation && (
                        <p className="text-gray-500 dark:text-gray-400 italic mt-1">
                          ({card.translation})
                        </p>
                      )}
                    </div>
                    {card.example && (
                      <div>
                        <h4 className="font-medium mb-1 text-gray-800 dark:text-gray-200">
                          Example:
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 italic">
                          &quot;{card.example}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-6 border-t border-gray-300 dark:border-gray-700 w-full">
            <div className="flex-1">
              <Button
                variant="outline"
                className="w-full px-8 py-4 border-input text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onNext}
                disabled={
                  currentPosition >= totalCards - 1 ||
                  pronunciationResult.isListening ||
                  isQualifying
                }
              >
                Next Word
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SpeakingPractice({ cards = [] }: SpeakingPracticeProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const currentCard = cards[currentCardIndex];
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  const handleNextCard = () => {
    if (currentCardIndex >= cards.length - 1) return;

    setCurrentCardIndex((prev) => prev + 1);
  };

  if (cards.length === 0) {
    return (
      <Card className="text-center p-6 bg-gray-800 text-white">
        <CardTitle className="mb-4">No Words Available</CardTitle>
        <CardDescription>There are no words in this list to practice.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:p-4 p-2  bg-white text-black min-h-screen dark:bg-transparent dark:text-white">
      <SpeakingQuestion
        key={currentCard.id}
        card={currentCard}
        onNext={handleNextCard}
        currentPosition={currentCardIndex}
        totalCards={cards.length}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-white/5 shadow-xl rounded-xl transition-colors duration-150 ease-in-out"
      >
        <SharedProgressCard
          title="Learning Progress"
          value={progress}
          cardClassName="border-gray-200 dark:border-gray-700 bg-transparent transition-colors duration-150 ease-in-out"
          headerClassName="pb-3"
          titleClassName="text-gray-800 dark:text-white transition-colors duration-150 ease-in-out"
          progressClassName="h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-gray-800 dark:[&>div]:bg-gray-200 transition-colors duration-150 ease-in-out"
          statsClassName="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-150 ease-in-out"
          stats={
            <>
              <div>
                Current Word: {cards.length > 0 ? currentCardIndex + 1 : 0}/{cards.length}
              </div>
              <div>Completed: {Math.round(progress)}%</div>
            </>
          }
        />
      </motion.div>
    </div>
  );
}
