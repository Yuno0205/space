"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle, Mic, RefreshCw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react"; // Thêm useCallback

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
import { VocabularyCard } from "@/types/vocabulary";
// Bỏ import usePronunciationStore
import { updateCompletedWords, updateProficiency } from "@/utils/Supabase/action";
import { dictionary } from "cmu-pronouncing-dictionary";

// --- Types ---
type DictType = Record<string, string | string[]>;

interface WordDisplay {
  text: string;
  color: string;
}
interface DetailScores {
  phoneme: number;
  accentProxy: number;
  rhythmProxy: number;
  speed: number;
}

interface SpeakingPracticeProps {
  cards?: VocabularyCard[];
  slug: string;
}

interface PronunciationResultState {
  wordsForDisplay: WordDisplay[];
  transcript: string;
  overallScore: number | null;
  detailScores: DetailScores | null;
  error: string | null;
  isListening: boolean;
}

const initialPronunciationResultState: PronunciationResultState = {
  wordsForDisplay: [],
  transcript: "",
  overallScore: null,
  detailScores: null,
  error: null,
  isListening: false,
};

export default function SpeakingPractice({ cards = [], slug }: SpeakingPracticeProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [isMarkedMastered, setIsMarkedMastered] = useState(false);

  // Gộp các state liên quan đến kết quả phát âm
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResultState>(
    initialPronunciationResultState
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentCard = cards[currentCardIndex] || {
    id: "0",
    word: "No words available",
    phonetic: "",
    definition: "There are no words in this list.",
    example: "",
    translation: "",
    word_type: "",
    audio_url: "",
  };
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  const resetPronunciationState = useCallback(() => {
    setPronunciationResult({
      ...initialPronunciationResultState,
      wordsForDisplay: currentCard.word
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ text: w, color: "text-gray-300" })),
    });
    setShowDefinition(false);
    setIsMarkedMastered(false);
  }, [currentCard.word]);

  useEffect(() => {
    resetPronunciationState();
  }, [currentCard.id, resetPronunciationState]); // Thêm resetPronunciationState vào dependency array

  const getPhonemes = useCallback((word: string): string => {
    if (!word || typeof word !== "string") return "";
    const lowerWord = word
      .toLowerCase()
      .trim()
      .replace(/[.,!?]/g, "");
    if (!lowerWord) return "";
    if (
      typeof dictionary !== "object" ||
      dictionary === null ||
      Object.keys(dictionary).length === 0
    ) {
      console.warn("CMU Dictionary is not available or empty.");
      return "";
    }
    const phonemeEntry = (dictionary as DictType)[lowerWord];
    if (Array.isArray(phonemeEntry)) return phonemeEntry.length > 0 ? phonemeEntry[0] : "";
    return phonemeEntry || "";
  }, []);

  const levenshteinSimilarity = useCallback((strA: string, strB: string): number => {
    const a = strA.toLowerCase();
    const b = strB.toLowerCase();
    if (!a.length && !b.length) return 1;
    if (!a.length || !b.length) return 0;
    const dp = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(null));
    for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
    for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    const distance = dp[a.length][b.length];
    return 1 - distance / Math.max(a.length, b.length);
  }, []);

  const analyzePronunciation = useCallback(
    (currentTargetText: string, spokenText: string, sttConfidence: number) => {
      const tgtWordsOriginal = currentTargetText.split(/\s+/).filter(Boolean);
      const tgtWordsLower = currentTargetText.toLowerCase().split(/\s+/).filter(Boolean);
      const spkWordsLower = spokenText.toLowerCase().split(/\s+/).filter(Boolean);

      let correctWordCount = 0;
      const newWordDisplays: WordDisplay[] = tgtWordsOriginal.map((originalTargetWord, i) => {
        const targetWordLower = tgtWordsLower[i];
        const spokenWordLower = spkWordsLower[i] || "";
        if (spokenWordLower === targetWordLower) {
          correctWordCount++;
          return { text: originalTargetWord, color: "text-green-500" };
        } else if (spokenWordLower) {
          const similarity = levenshteinSimilarity(spokenWordLower, targetWordLower);
          return {
            text: originalTargetWord,
            color: similarity >= 0.7 ? "text-yellow-500" : "text-red-500",
          };
        } else {
          return { text: originalTargetWord, color: "text-red-500" };
        }
      });

      const wordScore =
        tgtWordsLower.length > 0 ? Math.round((correctWordCount / tgtWordsLower.length) * 100) : 0;
      let phonemeMatchContributionSum = 0;
      let wordsWithPhonemesCount = 0;

      tgtWordsLower.forEach((targetWord, i) => {
        const currentSpokenWord = spkWordsLower[i] || "";
        const targetPhonemes = getPhonemes(targetWord);
        if (targetPhonemes) {
          wordsWithPhonemesCount++;
          const spokenWordCanonicalPhonemes = getPhonemes(currentSpokenWord);
          let wordPhonemeSimilarity = 0;
          if (spokenWordCanonicalPhonemes) {
            wordPhonemeSimilarity = levenshteinSimilarity(
              targetPhonemes,
              spokenWordCanonicalPhonemes
            );
          }
          if (targetWord === currentSpokenWord && currentSpokenWord !== "") {
            phonemeMatchContributionSum +=
              wordPhonemeSimilarity * (sttConfidence > 0 ? sttConfidence : 0.1);
          } else {
            phonemeMatchContributionSum += wordPhonemeSimilarity;
          }
        }
      });

      const phonemeScoreVal =
        wordsWithPhonemesCount > 0
          ? Math.round((phonemeMatchContributionSum / wordsWithPhonemesCount) * 100)
          : tgtWordsLower.length > 0 && spkWordsLower.length === 0
            ? 0
            : 50;
      const accentProxyVal = Math.min(
        100,
        Math.max(
          0,
          phonemeScoreVal + Math.round(15 * (sttConfidence > 0 ? sttConfidence : 0.5) - 5)
        )
      );
      const rhythmProxyVal = Math.max(0, wordScore - 10);
      let speedScoreVal = 100;
      if (tgtWordsLower.length > 0) {
        const rate = spkWordsLower.length / tgtWordsLower.length;
        if (rate < 0.7) speedScoreVal = Math.round(100 * rate * rate);
        else if (rate > 1.3) speedScoreVal = Math.round(100 - (rate - 1.3) * 150);
      } else if (spkWordsLower.length > 0) {
        speedScoreVal = 0;
      }
      speedScoreVal = Math.max(0, Math.min(100, speedScoreVal));
      const finalScore = Math.round(
        phonemeScoreVal * 0.5 + accentProxyVal * 0.2 + rhythmProxyVal * 0.1 + speedScoreVal * 0.2
      );
      const calculatedDetailScores = {
        phoneme: phonemeScoreVal,
        accentProxy: accentProxyVal,
        rhythmProxy: rhythmProxyVal,
        speed: speedScoreVal,
      };

      setPronunciationResult((prev) => ({
        ...prev,
        transcript: spokenText,
        overallScore: finalScore,
        detailScores: calculatedDetailScores,
        wordsForDisplay: newWordDisplays,
      }));
      // Không còn gọi addScore nữa
    },
    [getPhonemes, levenshteinSimilarity]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setPronunciationResult((prev) => ({
        ...prev,
        error: "Your browser does not support the Web Speech API. Please try Chrome or Edge.",
      }));
      return;
    }
    const srInstance = new SpeechRecognitionAPI();
    srInstance.continuous = false;
    srInstance.interimResults = false;
    srInstance.lang = "en-GB";

    srInstance.onstart = () => {
      setPronunciationResult((prev) => ({ ...prev, isListening: true, error: null }));
    };

    srInstance.onresult = (event: SpeechRecognitionEvent) => {
      const bestAlternative = event.results[0][0];
      const spokenText = bestAlternative.transcript.trim();
      const confidence = bestAlternative.confidence;
      analyzePronunciation(currentCard.word, spokenText, confidence);
    };

    srInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorText = `Speech recognition error: ${event.error}`;
      if (event.error === "no-speech") errorText = "No speech detected. Please try again.";
      else if (event.error === "audio-capture")
        errorText = "Microphone not found. Please check your device.";
      else if (event.error === "not-allowed")
        errorText = "Microphone access denied. Please grant permission.";

      setPronunciationResult((prev) => ({ ...prev, isListening: false, error: errorText }));
      setTimeout(() => setPronunciationResult((prev) => ({ ...prev, error: null })), 7000);
    };

    srInstance.onend = () => {
      setPronunciationResult((prev) => ({ ...prev, isListening: false }));
    };
    recognitionRef.current = srInstance;
    return () => {
      recognitionRef.current?.abort();
    };
  }, [currentCard.word, analyzePronunciation]);

  const startListening = () => {
    if (recognitionRef.current && !pronunciationResult.isListening) {
      setPronunciationResult((prev) => ({
        ...prev,
        transcript: "",
        overallScore: null,
        detailScores: null,
        wordsForDisplay: currentCard.word
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => ({ text: w, color: "text-gray-300" })),
        error: null,
      }));
      try {
        recognitionRef.current.start();
      } catch (e: unknown) {
        console.error("Error starting recognition:", e);
        const errorText =
          e instanceof Error && e.name === "InvalidStateError"
            ? "Recognition state error, please try again shortly."
            : "Could not start speech recognition.";
        setPronunciationResult((prev) => ({ ...prev, isListening: false, error: errorText }));
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && pronunciationResult.isListening) {
      recognitionRef.current.stop();
    }
  };

  const playAudio = () => {
    if (currentCard.audio_url) {
      const audio = new Audio(currentCard.audio_url);
      audio.play().catch((e) => console.error("Error playing audio URL:", e));
    } else if ("speechSynthesis" in window && currentCard.word) {
      if (speechSynthesis.speaking) speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      utterance.lang = "en-GB";
      speechSynthesis.speak(utterance);
    } else {
      setPronunciationResult((prev) => ({
        ...prev,
        error: "No audio file available or your browser does not support speech synthesis.",
      }));
      setTimeout(() => setPronunciationResult((prev) => ({ ...prev, error: null })), 3000);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      // Việc reset state sẽ được xử lý bởi useEffect [currentCard.id]
    }
  };

  const resetCurrentCardPractice = () => {
    resetPronunciationState();
  };

  const toggleDefinition = () => setShowDefinition(!showDefinition);

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

  // Bỏ isLoading vì không còn phụ thuộc vào usePronunciationStore
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
        key={currentCard.id} // Key để re-render khi từ thay đổi
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
                {currentCardIndex + 1}/{cards.length}
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
                  {currentCard.phonetic && (
                    <p className="dark:text-gray-400 text-gray-500 text-lg">
                      {currentCard.phonetic}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full dark:hover:bg-gray-700 hover:bg-gray-200"
                    onClick={playAudio}
                    title="Listen to pronunciation"
                    aria-label="Listen to pronunciation"
                  >
                    <Volume2 className="h-5 w-5" />
                    <span className="sr-only">Play audio</span>
                  </Button>
                </div>
                {currentCard.word_type && (
                  <Badge
                    variant="outline"
                    className="mt-3 bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {currentCard.word_type}
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
                                <span>Phoneme:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.phoneme
                                  )}
                                >
                                  {pronunciationResult.detailScores.phoneme}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.phoneme}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-sky-500"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Accent:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.accentProxy
                                  )}
                                >
                                  {pronunciationResult.detailScores.accentProxy}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.accentProxy}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-teal-500"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Rhythm:</span>
                                <span
                                  className={getScoreColor(
                                    pronunciationResult.detailScores.rhythmProxy
                                  )}
                                >
                                  {pronunciationResult.detailScores.rhythmProxy}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.rhythmProxy}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-indigo-500"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                                <span>Speed/Coverage:</span>
                                <span
                                  className={getScoreColor(pronunciationResult.detailScores.speed)}
                                >
                                  {pronunciationResult.detailScores.speed}%
                                </span>
                              </div>
                              <Progress
                                value={pronunciationResult.detailScores.speed}
                                className="h-2 bg-gray-300 dark:bg-gray-600 [&>div]:bg-purple-500"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-center mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetCurrentCardPractice}
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
                              onClick={async () => {
                                if (
                                  pronunciationResult.overallScore !== null &&
                                  pronunciationResult.overallScore >= 85 &&
                                  !isMarkedMastered
                                ) {
                                  try {
                                    await updateProficiency(currentCard.id, "speaking", true);
                                    await updateCompletedWords(slug);
                                    setIsMarkedMastered(true);
                                  } catch (dbError) {
                                    console.error("Error updating Supabase:", dbError);
                                    setPronunciationResult((prev) => ({
                                      ...prev,
                                      error: "Failed to save mastery status.",
                                    }));
                                  }
                                }
                              }}
                              className={cn(
                                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-150 ease-in-out",
                                isMarkedMastered
                                  ? "bg-green-100 text-green-700 border-green-500 dark:bg-green-800/30 dark:text-green-400 dark:border-green-600 cursor-default"
                                  : pronunciationResult.overallScore !== null &&
                                      pronunciationResult.overallScore >= 85
                                    ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border-blue-500 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                    : "text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                              )}
                              title={
                                isMarkedMastered
                                  ? "Marked as mastered for this attempt"
                                  : pronunciationResult.overallScore !== null &&
                                      pronunciationResult.overallScore >= 85
                                    ? "Mark this word as proficiently pronounced"
                                    : "Score 85 or above to mark as mastered"
                              }
                              disabled={
                                pronunciationResult.overallScore === null ||
                                pronunciationResult.overallScore < 85 ||
                                isMarkedMastered
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {isMarkedMastered ? "Marked as Mastered" : "Mark as Mastered"}
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
                      <p className="text-gray-600 dark:text-gray-300">{currentCard.definition}</p>
                      {currentCard.translation && (
                        <p className="text-gray-500 dark:text-gray-400 italic mt-1">
                          ({currentCard.translation})
                        </p>
                      )}
                    </div>
                    {currentCard.example && (
                      <div>
                        <h4 className="font-medium mb-1 text-gray-800 dark:text-gray-200">
                          Example:
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 italic">
                          &quot;{currentCard.example}&quot;
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
                onClick={handleNextCard}
                disabled={currentCardIndex >= cards.length - 1 || pronunciationResult.isListening}
              >
                Next Word
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-white/5 shadow-xl rounded-xl transition-colors duration-150 ease-in-out"
      >
        <Card className="border-gray-200 dark:border-gray-700 bg-transparent transition-colors duration-150 ease-in-out">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-800 dark:text-white transition-colors duration-150 ease-in-out">
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={progress}
              className="h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-gray-800 dark:[&>div]:bg-gray-200 transition-colors duration-150 ease-in-out"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-150 ease-in-out">
              <div>
                Current Word: {cards.length > 0 ? currentCardIndex + 1 : 0}/{cards.length}
              </div>
              <div>Completed: {Math.round(progress)}%</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
