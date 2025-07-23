"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Lightbulb, Play, RotateCcw, Volume2, XCircle } from "lucide-react";

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
import { VocabularyCard } from "@/types/vocabulary";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { shuffleArray } from "@/lib/utils";

// Memoized components for better performance
const ScoreCard = React.memo(
  ({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) => (
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
            {score} / {total}
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg w-1/2">
              <div className="font-semibold text-gray-600 dark:text-gray-400">Accuracy</div>
              <div className="text-lg font-bold text-black dark:text-white">
                {total > 0 ? Math.round((score / total) * 100) : 0}%
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            onClick={onRestart}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Restart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
);

const ProgressCard = React.memo(({ current, total }: { current: number; total: number }) => {
  const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
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
            aria-label={`Progress: ${current + 1} of ${total} words completed`}
          />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
            {current + 1} / {total} words
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export const ListeningPractice = React.memo<{ vocabularies: VocabularyCard[] }>(
  ({ vocabularies }) => {
    const { speak, cancel, isSpeaking } = useSpeechSynthesis();

    const [exercises, setExercises] = useState<VocabularyCard[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showFinalScore, setShowFinalScore] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);

    const currentExercise = useMemo(
      () => exercises[currentQuestionIndex],
      [exercises, currentQuestionIndex]
    );

    // Initialize exercises
    useEffect(() => {
      if (vocabularies?.length > 0) {
        setExercises(shuffleArray(vocabularies));
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowFinalScore(false);
      } else {
        setExercises([]);
      }
    }, [vocabularies]);

    // Reset state for new question
    const prepareExercise = useCallback(() => {
      setUserAnswer("");
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
      cancel();
      // Focus with slight delay to ensure DOM is ready
      setTimeout(() => inputRef.current?.focus(), 100);
    }, [cancel]);

    useEffect(() => {
      if (currentExercise) {
        prepareExercise();
      }
    }, [currentQuestionIndex, prepareExercise, currentExercise]);

    // Audio playback with fallback
    const handlePlaySentence = useCallback(() => {
      if (!currentExercise) return;

      const playWithTTS = () => speak(currentExercise.word);

      if (currentExercise.audio_url) {
        const audio = new Audio(currentExercise.audio_url);
        audio.onerror = () => {
          console.warn(`Failed to load audio: ${currentExercise.audio_url}`);
          playWithTTS();
        };
        audio.play().catch(playWithTTS);
      } else {
        playWithTTS();
      }
    }, [currentExercise, speak]);

    // Answer submission
    const submitAnswer = useCallback(() => {
      if (isAnswerSubmitted || !currentExercise || !userAnswer.trim()) return;

      const submittedAnswer = userAnswer.toLowerCase().trim();
      const correctAnswer = currentExercise.word.toLowerCase().trim();
      const correct = submittedAnswer === correctAnswer;

      setIsCorrect(correct);
      setIsAnswerSubmitted(true);

      if (correct) {
        setScore((prev) => prev + 1);
      }
    }, [isAnswerSubmitted, currentExercise, userAnswer]);

    // Navigation
    const nextQuestion = useCallback(() => {
      if (currentQuestionIndex < exercises.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowFinalScore(true);
      }
    }, [currentQuestionIndex, exercises.length]);

    const restartQuiz = useCallback(() => {
      if (vocabularies?.length > 0) {
        setExercises(shuffleArray(vocabularies));
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowFinalScore(false);
      }
    }, [vocabularies]);

    // Event handlers
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && userAnswer.trim() && !isAnswerSubmitted) {
          submitAnswer();
        }
      },
      [userAnswer, isAnswerSubmitted, submitAnswer]
    );

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setUserAnswer(e.target.value);
    }, []);

    // Loading state
    if (!vocabularies?.length || exercises.length === 0) {
      return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
          <div className="text-center p-10">
            {!vocabularies?.length ? "No vocabulary available..." : "Loading exercises..."}
          </div>
        </div>
      );
    }

    // Final score
    if (showFinalScore) {
      return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 flex items-center justify-center">
          <div className="space-y-6 max-w-2xl mx-auto text-center p-6">
            <ScoreCard score={score} total={exercises.length} onRestart={restartQuiz} />
          </div>
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
                          aria-label="Show hint"
                        >
                          <Lightbulb className="h-6 w-6" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                        {currentExercise.phonetic ? (
                          <p className="font-mono text-lg" role="note" aria-label="Phonetic hint">
                            {currentExercise.phonetic}
                          </p>
                        ) : currentExercise.translation ? (
                          <p
                            className="text-base font-semibold"
                            role="note"
                            aria-label="Translation hint"
                          >
                            {currentExercise.translation}
                          </p>
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
                      disabled={isSpeaking}
                      size="icon"
                      className="h-16 w-16 rounded-full shadow-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-70"
                      aria-label={isSpeaking ? "Playing audio" : "Play word audio"}
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
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isAnswerSubmitted}
                    className="text-center text-2xl h-14 max-w-md mx-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    aria-label="Type the word you hear"
                  />
                </div>

                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-4 p-4 rounded-xl text-center font-medium shadow-lg ${
                      isCorrect
                        ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 text-green-700 dark:text-green-300 border-2 border-green-500"
                        : "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800/40 dark:to-red-700/40 text-red-700 dark:text-red-300 border-2 border-red-500"
                    }`}
                    role="status"
                    aria-live="polite"
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
                    {isCorrect && currentExercise.definition && (
                      <div className="text-sm">
                        <p>Definition: {currentExercise.definition}</p>
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
                      disabled={!userAnswer.trim()}
                      className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:text-gray-600"
                    >
                      Check
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <ProgressCard current={currentQuestionIndex} total={exercises.length} />
        </div>
      </div>
    );
  }
);
