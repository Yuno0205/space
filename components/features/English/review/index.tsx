"use client";

import { SharedProgressCard } from "@/components/shared/Progress";
import { createClient } from "@/lib/supabase/client";
import { normalizeToken } from "@/utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { generateQuestion } from "./_lib/question-generator";
import { QuestionRenderer } from "./QuestionRenderer";
import { ReviewResult, ReviewSessionData, ReviewSubmission, TProgress, TQuestion } from "./types";

type ReviewSessionProps = {
  initialData: ReviewSessionData;
};

export function ReviewSession({ initialData }: ReviewSessionProps) {
  const supabase = useMemo(() => createClient(), []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dueProgress, setDueProgress] = useState<TProgress[]>(initialData.dueProgress);

  const allActivities = initialData.activities;
  const allVocabularies = initialData.vocabularies;

  const [currentIndex, setCurrentIndex] = useState(initialData.initialIndex);

  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(
    initialData.initialQuestion
  );
  const [sessionComplete, setSessionComplete] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [result, setResult] = useState<ReviewResult>(null);

  const router = useRouter();

  const getNextValidQuestion = useCallback(
    (startIndex: number, progressList: TProgress[]) => {
      for (let i = startIndex; i < progressList.length; i += 1) {
        const question = generateQuestion(progressList[i], allActivities, allVocabularies);
        if (question) {
          return { index: i, question };
        }
      }
      return null;
    },
    [allActivities, allVocabularies]
  );

  const remainingCount = useMemo(
    () => Math.max(dueProgress.length - currentIndex, 0),
    [dueProgress.length, currentIndex]
  );

  const sessionProgressValue = useMemo(() => {
    if (!dueProgress.length) return 0;
    return ((currentIndex + 1) / dueProgress.length) * 100;
  }, [currentIndex, dueProgress.length]);

  const goToNextQuestion = useCallback(() => {
    const nextValid = getNextValidQuestion(currentIndex + 1, dueProgress);

    setSelectedOption(null);
    setTypedAnswer("");
    setResult(null);

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

      // 1. Normalize answer thành ReviewSubmission
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
        // Speaking đã tự tính score/isCorrect và truyền lên
        if (!submission) {
          return false;
        }

        reviewSubmission = submission;
        outcome = "completed";
      }

      setSubmitting(true);
      setError(null);

      try {
        // 2. Gửi toàn bộ kết quả xuống DB
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

        // 3. Show kết quả cho user
        setResult({
          isCorrect: reviewSubmission.isCorrect,
          correctAnswer: answerToShow,
          score: reviewSubmission.score,
          outcome,
        });

        // 4. Đồng bộ local state với kết quả RPC trả về
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

  if (error) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 shadow-sm dark:border-red-500/40 dark:bg-slate-950 dark:shadow-none">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dueProgress.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          No vocabulary is due for review
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          You don&apos;t have any words scheduled for review right now. Learn some new words or come
          back when your next review is due.
        </p>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Session complete! 🎉
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          You have reviewed all {dueProgress.length} words.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Start new session
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          No valid review question is available
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Your due words are missing required data for the current activity types. Please refresh
          after updating vocabulary details.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Refresh list
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full space-y-6 text-slate-900 dark:text-slate-100">
      <div>
        <QuestionRenderer
          key={`${currentQuestion.progress.id}-${currentQuestion.activity.id}`}
          question={currentQuestion}
          result={result}
          submitting={submitting}
          selectedOption={selectedOption}
          typedAnswer={typedAnswer}
          setSelectedOption={setSelectedOption}
          setTypedAnswer={setTypedAnswer}
          onSubmit={handleSubmit}
        />

        {result ? (
          <div className="mt-6 space-y-4">
            <div
              className={[
                "rounded-xl border-2 p-4 text-sm font-medium",
                result.isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400/60 dark:bg-emerald-500/10 dark:text-emerald-100"
                  : "border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-950/20 dark:text-red-100",
              ].join(" ")}
            >
              {result.outcome === "completed"
                ? (() => {
                    const score = result.score ?? 0;
                    if (score >= 70) {
                      return `Congratulations! You passed with a score of ${score}.`;
                    } else if (score >= 50) {
                      return `Good effort! Your score is ${score}. You need 70 to pass — keep practising!`;
                    } else {
                      return `Your score is ${score}. Don't give up — try again to improve your pronunciation!`;
                    }
                  })()
                : result.isCorrect
                  ? "Correct!"
                  : `Not quite. The correct answer is: ${result.correctAnswer}`}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToNextQuestion}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                {currentIndex + 1 >= dueProgress.length ? "Finish session" : "Next question"}
              </button>

              <button
                type="button"
                onClick={() => router.refresh()}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-100 dark:shadow-none dark:hover:border-slate-500 dark:hover:bg-slate-800/60"
              >
                Refresh list
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {!result || result.isCorrect
        ? null
        : (() => {
            const vocab = currentQuestion.progress.vocabulary;
            if (!vocab) return null;

            return (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Word details
                </h4>
                <div className="mt-3 space-y-1 text-slate-700 dark:text-slate-200">
                  <p>
                    <span className="font-medium text-slate-900 dark:text-slate-100">Word:</span>{" "}
                    {vocab.word}
                    {vocab.phonetic ? (
                      <span className="ml-2 text-slate-500 dark:text-slate-400">
                        /{vocab.phonetic}/
                      </span>
                    ) : null}
                  </p>
                  {vocab.translation ? (
                    <p>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        Translation:
                      </span>{" "}
                      {vocab.translation}
                    </p>
                  ) : null}
                  {vocab.definition ? (
                    <p>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        Definition:
                      </span>{" "}
                      {vocab.definition}
                    </p>
                  ) : null}
                  {vocab.example ? (
                    <p>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        Example:
                      </span>{" "}
                      <span className="italic">{vocab.example}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })()}
      <SharedProgressCard
        title="Learning Progress"
        value={sessionProgressValue}
        cardClassName="border-gray-200 dark:border-gray-700 bg-transparent transition-colors duration-150 ease-in-out"
        headerClassName="pb-3"
        titleClassName="text-gray-800 dark:text-white transition-colors duration-150 ease-in-out"
        progressClassName="h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-gray-800 dark:[&>div]:bg-gray-200 transition-colors duration-150 ease-in-out"
        statsClassName="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-150 ease-in-out"
        stats={
          <>
            <div>
              Current Word: {currentIndex + 1} / {dueProgress.length}
            </div>
            <div>Remaining: {Math.round(remainingCount)}</div>
          </>
        }
      />
    </div>
  );
}
