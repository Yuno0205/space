"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Headphones, Lightbulb, Volume2 } from "lucide-react";

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

interface ListeningPracticeProps {
  vocabularies: VocabularyCard[];
}

interface ListeningQuestionProps {
  exercise: VocabularyCard;
  currentPosition: number;
  totalExercises: number;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * State + interaction belonging to ONE listening question.
 *
 * Because ListeningQuestion is rendered with:
 *
 * key={currentExercise.id}
 *
 * React will create fresh state whenever the exercise changes.
 */
function ListeningQuestion({
  exercise,
  currentPosition,
  totalExercises,
  onNext,
  onSkip,
}: ListeningQuestionProps) {
  const { playAudio, isPlaying } = useSpeechSynthesis();

  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Derived value — no need for another state.
   */
  const isCorrect = isSubmitted
    ? userAnswer.trim().toLowerCase() === exercise.word.trim().toLowerCase()
    : null;

  /**
   * Focusing an input is a DOM side effect,
   * so useEffect is appropriate here.
   *
   * This runs once for each ListeningQuestion instance.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = () => {
    if (!userAnswer.trim() || isSubmitted) {
      return;
    }

    setIsSubmitted(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && userAnswer.trim() && !isSubmitted) {
      handleSubmit();
    }
  };

  const isLastExercise = currentPosition === totalExercises;

  return (
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
              {currentPosition}/{totalExercises}
            </div>
          </CardTitle>

          <CardDescription>Play the audio and type the word you hear</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center pb-0">
          <div className="relative flex aspect-square w-full max-w-md flex-col items-center justify-center rounded-xl border border-black/20 bg-white/5 p-6 dark:border-white/10">
            {exercise.word_type && (
              <Badge variant="outline" className="mb-4 px-4 py-2 capitalize">
                {exercise.word_type}
              </Badge>
            )}

            {/* Audio Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  playAudio({
                    audioUrl: exercise.audio_url,
                    text: exercise.word,
                  })
                }
                disabled={isPlaying}
                className="h-16 w-16 rounded-full"
                aria-label={isPlaying ? "Playing audio..." : "Play audio"}
              >
                <Volume2 className="h-8 w-8" />
              </Button>
            </motion.div>

            <p className="mb-6 mt-2 text-sm text-gray-400">Tap to listen</p>

            {/* Answer */}
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type what you hear..."
              value={userAnswer}
              onChange={(event) => setUserAnswer(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitted}
              className="h-14 max-w-sm text-center text-base lg:text-2xl"
              autoComplete="off"
              spellCheck={false}
              aria-label="Your answer"
            />

            {/* Result */}
            {isSubmitted && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-4 space-y-1 text-center"
              >
                <p className={cn("font-medium", isCorrect ? "text-green-500" : "text-red-500")}>
                  {isCorrect ? "Correct!" : `The correct answer is: ${exercise.word}`}
                </p>

                {exercise.definition && (
                  <p className="text-sm text-gray-400">{exercise.definition}</p>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          {/* Hint */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
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
                  {exercise.phonetic || exercise.translation || "No hint available."}
                </p>
              </PopoverContent>
            </Popover>
          </motion.div>

          {/* Skip */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex items-center"
              disabled={isSubmitted}
              aria-label="Skip card"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Submit / Next */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            {isSubmitted ? (
              <Button onClick={onNext} variant="outline" className="flex items-center">
                <Check className="mr-2 h-4 w-4" />

                <span className="hidden sm:inline">{isLastExercise ? "Finish" : "Next"}</span>
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
  );
}

export const ListeningPractice = ({ vocabularies }: ListeningPracticeProps) => {
  /**
   * Shuffle only once when this practice session is created.
   *
   * We keep exercises as state because the randomized order
   * should remain stable through re-renders.
   */
  const [exercises] = useState<VocabularyCard[]>(() => shuffleArray([...vocabularies]));

  const [currentIndex, setCurrentIndex] = useState(0);

  const [skippedWords, setSkippedWords] = useState<string[]>([]);

  /**
   * Derived values.
   */
  const currentExercise = exercises[currentIndex];

  const isFinished = currentIndex >= exercises.length;

  const progress =
    exercises.length > 0 ? Math.min(((currentIndex + 1) / exercises.length) * 100, 100) : 0;

  const remaining = exercises.length > 0 ? Math.max(exercises.length - currentIndex - 1, 0) : 0;

  /**
   * Session navigation.
   *
   * Question-specific state does NOT need to be reset here.
   * The key on ListeningQuestion handles that.
   */
  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    if (!currentExercise) {
      return;
    }

    setSkippedWords((prev) => {
      if (prev.includes(currentExercise.id)) {
        return prev;
      }

      return [...prev, currentExercise.id];
    });

    goToNext();
  };

  /**
   * Empty session
   */
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

  /**
   * Session completed
   *
   * Score has been removed as discussed,
   * so this is now derived from currentIndex.
   */
  if (isFinished) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Listening Practice Complete</CardTitle>

            <CardDescription>
              You&apos;ve completed all {exercises.length} listening cards.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">Skipped: {skippedWords.length}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/*
        key is important.

        When currentExercise.id changes:
        - old ListeningQuestion unmounts
        - new ListeningQuestion mounts
        - userAnswer becomes ""
        - isSubmitted becomes false

        No reset effect needed.
      */}
      <ListeningQuestion
        key={currentExercise.id}
        exercise={currentExercise}
        currentPosition={currentIndex + 1}
        totalExercises={exercises.length}
        onNext={goToNext}
        onSkip={handleSkip}
      />

      {/* Progress */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 0.2,
        }}
      >
        <SharedProgressCard
          title="Progress"
          value={progress}
          headerClassName="pb-3"
          progressClassName="h-2"
          statsClassName="flex flex-col sm:flex-row justify-between mt-2 text-sm text-gray-400"
          stats={
            <>
              <div>Skipped: {skippedWords.length}</div>

              <div>Remaining: {remaining}</div>
            </>
          }
        />
      </motion.div>
    </div>
  );
};
