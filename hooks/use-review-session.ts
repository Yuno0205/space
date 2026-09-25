"use client";

import { generateQuestion } from "@/components/features/English/review/_lib/question-generator";
import {
  ReviewFeedback,
  ReviewResult,
  ReviewSessionData,
  ReviewSubmission,
  SPEAKING_PASS_SCORE,
  TProgress,
  TQuestion,
} from "@/components/features/English/review/types";
import { createClient } from "@/lib/supabase/client";
import { normalizeToken } from "@/utils";
import { useCallback, useMemo, useState } from "react";

export function useReviewSession(initialData: ReviewSessionData) {
  const supabase = useMemo(() => createClient(), []);
  const [dueProgress, setDueProgress] = useState<TProgress[]>(initialData.dueProgress);

  const [currentIndex, setCurrentIndex] = useState(initialData.initialIndex);

  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(
    initialData.initialQuestion
  );

  const [sessionComplete, setSessionComplete] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [typedAnswer, setTypedAnswer] = useState("");

  const [result, setResult] = useState<ReviewResult | null>(null);
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const activities = initialData.activities;
  const vocabularies = initialData.vocabularies;

  const getNextValidQuestion = useCallback(
    (
      startIndex: number,
      progressList: TProgress[]
    ): {
      index: number;
      question: TQuestion;
    } | null => {
      for (let index = startIndex; index < progressList.length; index += 1) {
        const question = generateQuestion(progressList[index], activities, vocabularies);

        if (question) {
          return {
            index,
            question,
          };
        }
      }

      return null;
    },
    [activities, vocabularies]
  );

  const hasNextQuestion = useMemo(() => {
    return getNextValidQuestion(currentIndex + 1, dueProgress) !== null;
  }, [currentIndex, dueProgress, getNextValidQuestion]);

  const goToNextQuestion = useCallback(() => {
    const nextValid = getNextValidQuestion(currentIndex + 1, dueProgress);

    // reset state for prev question
    setSelectedOption(null);
    setTypedAnswer("");
    setResult(null);
    setFeedback(null);
    setError(null);

    if (!nextValid) {
      setCurrentQuestion(null);
      setSessionComplete(true);
      return;
    }

    setCurrentIndex(nextValid.index);
    setCurrentQuestion(nextValid.question);
  }, [currentIndex, dueProgress, getNextValidQuestion]);

  const handleSubmit = useCallback(
    async (submission?: ReviewSubmission): Promise<boolean> => {
      if (!currentQuestion || submitting || result) {
        return false;
      }

      let reviewSubmission: ReviewSubmission;
      let answerToShow = "";
      let outcome: "answered" | "completed" = "answered";

      // Normalize each question type into a common ReviewSubmission
      if (currentQuestion.type === "mcq") {
        if (!selectedOption) {
          return false;
        }

        reviewSubmission = {
          isCorrect:
            normalizeToken(selectedOption) === normalizeToken(currentQuestion.correctAnswer),
          answer: selectedOption,
        };

        answerToShow = currentQuestion.correctAnswer;
      } else if (currentQuestion.type === "typing") {
        if (!typedAnswer.trim()) {
          return false;
        }

        reviewSubmission = {
          isCorrect: normalizeToken(typedAnswer) === normalizeToken(currentQuestion.correctAnswer),
          answer: typedAnswer,
        };

        answerToShow = currentQuestion.correctAnswer;
      } else {
        if (!submission) {
          return false;
        }

        reviewSubmission = submission;
        outcome = "completed";
      }

      setSubmitting(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc("submit_review_attempt", {
          p_progress_id: currentQuestion.progress.id,
          p_activity_type_id: currentQuestion.activity.id,
          p_is_correct: reviewSubmission.isCorrect,
          p_score: reviewSubmission.score ?? null,
          p_answer_text: reviewSubmission.answer ?? null,
        });

        if (error) {
          throw error;
        }

        const updatedProgress = data?.[0];

        if (!updatedProgress) {
          throw new Error("Review progress was not returned.");
        }

        setResult({
          isCorrect: reviewSubmission.isCorrect,
          correctAnswer: answerToShow,
          score: reviewSubmission.score,
          outcome,
        });

        setFeedback(
          getReviewFeedback(reviewSubmission.isCorrect, answerToShow, reviewSubmission.score)
        );

        setDueProgress((prev) =>
          prev.map((item) =>
            item.id === updatedProgress.progress_id
              ? {
                  ...item,
                  correct_streak: updatedProgress.correct_streak,
                  lapse_count: updatedProgress.lapse_count,
                  last_reviewed_at: updatedProgress.last_reviewed_at,
                  next_review_at: updatedProgress.next_review_at,
                }
              : item
          )
        );

        return true;
      } catch (err) {
        console.error("Review submit error:", err);

        const message =
          err instanceof Error
            ? err.message
            : typeof err === "object" &&
                err !== null &&
                "message" in err &&
                typeof err.message === "string"
              ? err.message
              : "Unable to save your answer. Please try again.";

        setError(message);

        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [currentQuestion, result, selectedOption, submitting, supabase, typedAnswer]
  );

  function getReviewFeedback(
    isCorrect: boolean,
    correctAnswer: string,
    score?: number
  ): ReviewFeedback {
    if (score !== undefined) {
      if (isCorrect) {
        return {
          isCorrect: true,
          score,
          message: `Great job! Your pronunciation score is ${score}.`,
        };
      }

      if (score >= 50) {
        return {
          isCorrect: false,
          score,
          message: `Good effort! Your score is ${score}. You need ${SPEAKING_PASS_SCORE} to pass.`,
        };
      }

      return {
        isCorrect: false,
        score,
        message: `Your score is ${score}. Keep practising and try again.`,
      };
    }

    return {
      isCorrect,
      message: isCorrect ? "Correct!" : `Not quite. The correct answer is: ${correctAnswer}`,
    };
  }

  const updateSpeakingFeedback = useCallback((score: number | null) => {
    if (score === null) {
      setFeedback(null);
      return;
    }

    setFeedback(getReviewFeedback(score >= SPEAKING_PASS_SCORE, "", score));
  }, []);

  return {
    // Session
    dueProgress,
    setDueProgress,

    currentIndex,
    currentQuestion,

    sessionComplete,

    // Answer state
    selectedOption,
    setSelectedOption,

    typedAnswer,
    setTypedAnswer,

    // Result
    result,
    setResult,

    // Request state
    submitting,
    setSubmitting,

    error,
    setError,

    feedback,

    // Actions
    hasNextQuestion,
    goToNextQuestion,
    handleSubmit,
    updateSpeakingFeedback,
  };
}
