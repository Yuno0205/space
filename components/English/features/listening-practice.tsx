"use client";

import { motion } from "framer-motion";
import { CheckCircle, Lightbulb, Volume2, XCircle } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { shuffleArray } from "@/lib/utils";
import { VocabularyCard } from "@/types/vocabulary";
import { ScoreCard } from "../ScoreCard";

export const ListeningPractice = ({ vocabularies }: { vocabularies: VocabularyCard[] }) => {
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  const [exercises, setExercises] = useState<VocabularyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const currentExercise = useMemo(() => exercises[currentIndex], [exercises, currentIndex]);
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;

  // Khởi tạo và reset bài tập
  const setupExercises = useCallback(() => {
    if (vocabularies?.length > 0) {
      setExercises(shuffleArray(vocabularies));
      setCurrentIndex(0);
      setScore(0);
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

  // Chuẩn bị cho câu hỏi mới
  useEffect(() => {
    if (currentExercise) {
      setUserAnswer("");
      setIsSubmitted(false);
      setIsCorrect(null);
      cancel();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIndex, currentExercise, cancel]);

  const handlePlayAudio = useCallback(() => {
    if (!currentExercise) return;
    const textToSpeak = currentExercise.word;
    const audioUrl = currentExercise.audio_url;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => speak(textToSpeak));
    } else {
      speak(textToSpeak);
    }
  }, [currentExercise, speak]);

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

  const handleNext = useCallback(() => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowFinalScore(true);
    }
  }, [currentIndex, exercises.length]);

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">
          {vocabularies === undefined ? "Loading exercises..." : "No vocabulary available."}
        </p>
      </div>
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
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-muted-foreground">
              Listen & Write
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isSubmitted} aria-label="Show hint">
                  <Lightbulb className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <p className="font-mono text-base">
                  {currentExercise.phonetic || currentExercise.translation || "No hint available."}
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-2 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Progress: {currentIndex + 1} / {exercises.length}
              </span>
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center space-y-8 py-10">
          {/* Hiển thị loại từ */}
          {currentExercise.word_type && (
            <Badge variant="outline" className="capitalize text-sm mb-4">
              {currentExercise.word_type}
            </Badge>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handlePlayAudio}
              disabled={isSpeaking}
              size="icon"
              className="h-20 w-20 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label={isSpeaking ? "Playing audio..." : "Play audio"}
            >
              <Volume2 className="h-9 w-9" />
            </Button>
          </motion.div>

          <Input
            ref={inputRef}
            type="text"
            placeholder="Type what you hear..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitted}
            className="text-center text-2xl h-16 max-w-sm"
            autoComplete="off"
            spellCheck="false"
            aria-label="Your answer"
          />

          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm"
            >
              <Alert
                variant={isCorrect ? "default" : "destructive"}
                className={
                  isCorrect
                    ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300"
                    : ""
                }
              >
                {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
                <AlertDescription>
                  {isCorrect
                    ? currentExercise.definition
                    : `The correct answer is: ${currentExercise.word}`}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t pt-6">
          {isSubmitted ? (
            <Button onClick={handleNext} className="min-w-[150px]">
              {currentIndex < exercises.length - 1 ? "Next" : "Finish"}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!userAnswer.trim()} className="min-w-[150px]">
              Check
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
