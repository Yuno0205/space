"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VocabularyCard } from "@/types/vocabulary";
import { shuffleArray } from "@/utils";

interface ListeningQuestionProps {
  exercise: VocabularyCard;
  onNext: () => void;
  onSkip: () => void;
}

function ListeningQuestion({ exercise, onNext, onSkip }: ListeningQuestionProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isCorrect = isSubmitted
    ? userAnswer.trim().toLowerCase() === exercise.word.trim().toLowerCase()
    : null;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!userAnswer.trim() || isSubmitted) return;

    setIsSubmitted(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && userAnswer.trim() && !isSubmitted) {
      handleSubmit();
    }
  };

  return (
    <div>
      <Button>
        <Volume2 className="h-4 w-4" />
      </Button>

      <Input
        ref={inputRef}
        value={userAnswer}
        onChange={(event) => setUserAnswer(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitted}
      />

      {isSubmitted && <p>{isCorrect ? "Correct!" : `The correct answer is: ${exercise.word}`}</p>}

      {!isSubmitted ? (
        <>
          <Button onClick={onSkip}>Skip</Button>

          <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
            Check
          </Button>
        </>
      ) : (
        <Button onClick={onNext}>Next</Button>
      )}
    </div>
  );
}

export function ListeningPractice({ vocabularies }: { vocabularies: VocabularyCard[] }) {
  const [exercises] = useState(() => shuffleArray([...vocabularies]));

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentExercise = exercises[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (!currentExercise) {
    return <div>Completed</div>;
  }

  return (
    <ListeningQuestion
      key={currentExercise.id}
      exercise={currentExercise}
      onNext={goToNext}
      onSkip={goToNext}
    />
  );
}
