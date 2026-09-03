"use client";

import { SharedProgressCard } from "@/components/shared/Progress";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { VocabularyCard } from "@/types/vocabulary";
import { cn, shuffleArray } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, Headphones, Lightbulb, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ScoreCard } from "../../../shared/Card/ScoreCard";

export const ListeningPractice = ({ vocabularies }: { vocabularies: VocabularyCard[] }) => {
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  const [exercises, setExercises] = useState<VocabularyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [skippedWords, setSkippedWords] = useState<string[]>([]);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const currentExercise = useMemo(() => exercises[currentIndex], [exercises, currentIndex]);
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;

  const setupExercises = useCallback(() => {
    if (vocabularies?.length > 0) {
      setExercises(shuffleArray(vocabularies));
      setCurrentIndex(0);
      setScore(0);
      setSkippedWords([]);
      setShowFinalScore(false);
      setUserAnswer("");
      setIsSubmitted(false);
      setIsCorrect(null);
    } else {
      setExercises([]);
    }
  }, [vocabularies]);

  useEffect(() => {
    setupExercises();
  }, [setupExercises]);

  useEffect(() => {
    if (currentExercise) {
      setUserAnswer("");
      setIsSubmitted(false);
      setIsCorrect(null);
      cancel();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIndex, currentExercise, cancel]);

  const handlePlayAudio = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!currentExercise) return;

      const textToSpeak = currentExercise.word;
      const audioUrl = currentExercise.audio_url?.trim();

      if (audioUrl) {
        const audio = new Audio(audioUrl);

        const playPromise = audio.play();

        // timeout maximum2 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Audio load timeout")), 2000);
        });

        Promise.race([playPromise, timeoutPromise]).catch((err) => {
          console.warn("Audio failed or timed out, fallback to TTS:", err);
          audio.pause(); // stop the request that is hanging
          audio.src = ""; // cancel the load, avoid leaking network requests
          speak(textToSpeak);
        });
        return;
      }

      speak(textToSpeak);
    },
    [currentExercise, speak]
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitted || !currentExercise || !userAnswer.trim()) return;

    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() === currentExercise.word.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
    }
  }, [isSubmitted, currentExercise, userAnswer]);

  const goToNext = useCallback(() => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowFinalScore(true);
    }
  }, [currentIndex, exercises.length]);

  const handleSkip = useCallback(() => {
    if (!currentExercise || isSubmitted) return;
    if (!skippedWords.includes(currentExercise.id)) {
      setSkippedWords((prev) => [...prev, currentExercise.id]);
    }
    goToNext();
  }, [currentExercise, isSubmitted, skippedWords, goToNext]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && userAnswer.trim() && !isSubmitted) {
        handleSubmit();
      }
    },
    [userAnswer, isSubmitted, handleSubmit]
  );

  if (!vocabularies?.length || exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listening Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No vocabulary cards available for practice at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  if (showFinalScore) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ScoreCard score={score} total={exercises.length} onRestart={setupExercises} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Headphones className="mr-2 h-5 w-5" />
                Listening Card
              </div>
              <div className="text-sm font-normal">
                {currentIndex + 1}/{exercises.length}
              </div>
            </CardTitle>
            <CardDescription>Play the audio and type the word you hear</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-0">
            <div className="w-full max-w-md aspect-square relative rounded-xl border dark:border-white/10 border-black/20 bg-white/5 p-6 flex flex-col items-center justify-center">
              {currentExercise.word_type && (
                <Badge variant="outline" className="mb-4 capitalize px-4 py-2">
                  {currentExercise.word_type}
                </Badge>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayAudio}
                  disabled={isSpeaking}
                  className="h-16 w-16 rounded-full"
                  aria-label={isSpeaking ? "Playing audio..." : "Play audio"}
                >
                  <Volume2 className="h-8 w-8" />
                </Button>
              </motion.div>

              <p className="text-sm text-gray-400 mt-2 mb-6">Tap to listen</p>

              <Input
                ref={inputRef}
                type="text"
                placeholder="Type what you hear..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitted}
                className="text-center text-2xl h-14 max-w-sm"
                autoComplete="off"
                spellCheck="false"
                aria-label="Your answer"
              />

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center space-y-1"
                >
                  <p className={cn("font-medium", isCorrect ? "text-green-500" : "text-red-500")}>
                    {isCorrect ? "Correct!" : `The correct answer is: ${currentExercise.word}`}
                  </p>
                  {currentExercise.definition && (
                    <p className="text-sm text-gray-400">{currentExercise.definition}</p>
                  )}
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center"
                    disabled={isSubmitted}
                    aria-label="Show hint"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Hint</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <p className="font-mono text-base">
                    {currentExercise.phonetic ||
                      currentExercise.translation ||
                      "No hint available."}
                  </p>
                </PopoverContent>
              </Popover>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex items-center"
                disabled={isSubmitted}
                aria-label="Skip card"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {isSubmitted ? (
                <Button onClick={goToNext} variant="outline" className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    {currentIndex < exercises.length - 1 ? "Next" : "Finish"}
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="outline"
                  className="flex items-center"
                  disabled={!userAnswer.trim()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Check</span>
                </Button>
              )}
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SharedProgressCard
          title="Progress"
          value={progress}
          headerClassName="pb-3"
          progressClassName="h-2"
          statsClassName="flex flex-col sm:flex-row justify-between mt-2 text-sm text-gray-400"
          stats={
            <>
              <div>Score: {score}</div>
              <div>Skipped: {skippedWords.length}</div>
              <div>
                Remaining:{" "}
                {exercises.length > 0 ? Math.max(exercises.length - currentIndex - 1, 0) : 0}
              </div>
            </>
          }
        />
      </motion.div>
    </div>
  );
};
