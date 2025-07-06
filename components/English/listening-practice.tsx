"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle, Lightbulb, Play, RotateCcw, Volume2, XCircle } from "lucide-react";
import { FC, useCallback, useEffect, useRef, useState } from "react";

interface Vocabulary {
  id: number | string;
  word: string;
  phonetic: string | null;
  audio: string | null;
  wordtype: string | null;
  definition: string | null;
  translation: string | null;
  example: string | null;
}

interface ListeningPracticeProps {
  vocabularies: Vocabulary[];
}

let synthVoices: SpeechSynthesisVoice[] = [];

const getSynthVoices = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (synthVoices.length > 0) return;
  synthVoices = window.speechSynthesis.getVoices();
};

if (typeof window !== "undefined" && window.speechSynthesis) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = getSynthVoices;
  }
}

const speak = (text: string, onEnd?: () => void): SpeechSynthesisUtterance | null => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("SpeechSynthesis API is not supported.");
    if (onEnd) setTimeout(onEnd, 1000);
    return null;
  }
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  getSynthVoices();

  let selectedVoice = synthVoices.find((voice) => voice.lang === "en-US");
  if (!selectedVoice) {
    selectedVoice = synthVoices.find((voice) => voice.lang.startsWith("en-"));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
    utterance.lang = "en-US";
    console.warn("No 'en-US' voice found. Using browser default for the language.");
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  // --- UPDATED: Gracefully handle the "interrupted" error ---
  utterance.onerror = (event) => {
    if (event.error === "interrupted") {
      console.warn(`Speech for "${text}" was intentionally interrupted.`);
    } else {
      console.error("SpeechSynthesis Error:", event.error, "for text:", `"${text}"`);
    }
    if (onEnd) onEnd();
  };

  speechSynthesis.speak(utterance);
  return utterance;
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const ListeningPractice: FC<ListeningPracticeProps> = ({ vocabularies }) => {
  const [exercises, setExercises] = useState<Vocabulary[]>([]);
  const [, setIsSpeaking] = useState<boolean>(false);
  const [, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showFinalScore, setShowFinalScore] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const currentExercise = exercises[currentQuestionIndex];

  useEffect(() => {
    if (vocabularies && vocabularies.length > 0) {
      setExercises(shuffleArray(vocabularies));
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowFinalScore(false);
    } else {
      setExercises([]);
    }
  }, [vocabularies]);

  // --- ADDED: Cleanup effect to cancel speech on unmount ---
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const progressPercentage =
    exercises.length > 0 ? ((currentQuestionIndex + 1) / exercises.length) * 100 : 0;

  const prepareExercise = useCallback(() => {
    setUserAnswer("");
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setIsSpeaking(false);

    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    setCurrentUtterance(null);

    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    prepareExercise();
  }, [currentQuestionIndex, exercises, prepareExercise]);

  const handlePlaySentence = () => {
    if (!currentExercise) return;

    const playUsingTTS = () => {
      setIsSpeaking(true);
      const utterance = speak(currentExercise.word, () => setIsSpeaking(false));
      setCurrentUtterance(utterance);
    };

    if (currentExercise.audio) {
      const audio = new Audio(currentExercise.audio);
      audio.onerror = () => {
        console.warn(`Failed to load audio file: "${currentExercise.audio}". Falling back to TTS.`);
        playUsingTTS();
      };
      audio.play().catch(() => {
        playUsingTTS();
      });
    } else {
      playUsingTTS();
    }
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted || !currentExercise || !userAnswer) return;

    const submittedAnswer = userAnswer.toLowerCase().trim();
    const correctAnswer = currentExercise.word.toLowerCase().trim();

    const correct = submittedAnswer === correctAnswer;

    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && userAnswer.length > 0 && !isAnswerSubmitted) {
      submitAnswer();
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowFinalScore(true);
    }
  };

  const restartQuiz = () => {
    setExercises(shuffleArray(vocabularies));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFinalScore(false);
  };

  if (showFinalScore) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 flex items-center justify-center">
        <div className="space-y-6 max-w-2xl mx-auto text-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">🎉 Complete!</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  You have completed the listening exercise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-black dark:text-white">
                  {score} / {exercises.length}
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg w-1/2">
                    <div className="font-semibold text-gray-600 dark:text-gray-400">Accuracy</div>
                    <div className="text-lg font-bold text-black dark:text-white">
                      {exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={restartQuiz}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Restart
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (exercises.length === 0 || !currentExercise) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="text-center p-10">Loading exercises or no vocabulary available...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="space-y-6 max-w-full mx-auto p-4">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl sm:text-2xl text-black dark:text-white">
                <div className="flex items-center">
                  <Volume2 className="mr-2 h-6 w-6 text-gray-600 dark:text-gray-400" />
                  Listening Practice: Type the Word
                </div>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isAnswerSubmitted}
                        className="disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-yellow-400 dark:text-gray-500 dark:hover:text-yellow-300 transition-colors"
                      >
                        <Lightbulb className="h-6 w-6" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                      {currentExercise.phonetic ? (
                        <p className="font-mono text-lg">{currentExercise.phonetic}</p>
                      ) : currentExercise.translation ? (
                        <p className="text-base font-semibold">{currentExercise.translation}</p>
                      ) : (
                        <p>No hint available.</p>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Exercise {currentQuestionIndex + 1}/{exercises.length} - Listen and type the word
                you hear.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handlePlaySentence}
                    size="icon"
                    className="h-16 w-16 rounded-full shadow-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    aria-label="Play Word"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </motion.div>
              </div>

              <div className="min-h-[80px] rounded-xl p-4 flex flex-col items-center justify-center gap-4">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type what you hear..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAnswerSubmitted}
                  className="text-center text-2xl h-14 max-w-md mx-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                />
              </div>

              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mt-4 p-4 rounded-xl text-center font-medium shadow-lg ${isCorrect ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 text-green-700 dark:text-green-300 border-2 border-green-500" : "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800/40 dark:to-red-700/40 text-red-700 dark:text-red-300 border-2 border-red-500"}`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <XCircle className="h-6 w-6" />
                    )}
                    <span className="text-sm sm:text-base">
                      {isCorrect ? "🎉 Correct!" : "❌ Incorrect"}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      <p>
                        Your answer: <span className="font-bold line-through">{userAnswer}</span>
                      </p>
                      <p>
                        Correct answer: <span className="font-bold">{currentExercise.word}</span>
                      </p>
                    </div>
                  )}
                  {isCorrect && (
                    <div className="text-sm">
                      <p>Definition: {currentExercise.definition || "No definition available."}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                Score: <span className="font-bold">{score}</span>/{exercises.length}
              </div>
              <div className="flex space-x-2 order-1 sm:order-2">
                {isAnswerSubmitted ? (
                  <Button
                    onClick={nextQuestion}
                    className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    {currentQuestionIndex < exercises.length - 1 ? "Next Word" : "Results"}
                  </Button>
                ) : (
                  <Button
                    onClick={submitAnswer}
                    disabled={userAnswer.length === 0}
                    className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:text-gray-600"
                  >
                    Check
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-black dark:text-white">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={progressPercentage}
                className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-black dark:[&>div]:bg-white"
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
                {currentQuestionIndex + 1} / {exercises.length} words
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
