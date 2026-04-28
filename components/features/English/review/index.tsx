"use client";

import { createClient } from "@/lib/supabase/client";
import { normalizeToken, pickRandom, shuffleArray } from "@/utils";
import { VocabularyCard } from "@/types/vocabulary";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QuestionRenderer } from "./QuestionRenderer";
import { ActivityType, SkillCode } from "@/types/revise";
import { SharedProgressCard } from "@/components/shared/Progress";

type TProgress = {
  id: string;
  skill_code: SkillCode;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  correct_count: number;
  wrong_count: number;
  created_at: string;
  updated_at: string;
  vocabulary?: VocabularyCard | null;
};

type QuestionBase = {
  progress: TProgress;
  activity: ActivityType;
  prompt: string;
  meta?: {
    audioUrl?: string | null;
    sentence?: string | null;
  };
};

export type TQuestion =
  | (QuestionBase & {
      type: "mcq";
      options: string[];
      correctAnswer: string;
    })
  | (QuestionBase & {
      type: "typing";
      correctAnswer: string;
    })
  | (QuestionBase & {
      type: "speaking";
    });

export type ReviewResult = {
  isCorrect: boolean;
  correctAnswer: string;
  score?: number;
  outcome?: "answered" | "completed";
} | null;

function buildFillBlankSentence(example: string, word: string) {
  if (!example || !word) return null;

  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escapedWord}\\b`, "i");

  if (!regex.test(example)) return null;

  return example.replace(regex, "_____");
}

function computeNextReviewDate(correctCountBeforeUpdate: number, isCorrect: boolean) {
  const now = new Date();

  if (!isCorrect) {
    now.setHours(now.getHours() + 12);
    return now.toISOString();
  }

  if (correctCountBeforeUpdate === 0) {
    now.setDate(now.getDate() + 1);
    return now.toISOString();
  }

  if (correctCountBeforeUpdate === 1) {
    now.setDate(now.getDate() + 3);
    return now.toISOString();
  }

  if (correctCountBeforeUpdate === 2) {
    now.setDate(now.getDate() + 7);
    return now.toISOString();
  }

  now.setDate(now.getDate() + 14);
  return now.toISOString();
}

function generateQuestion(
  progress: TProgress,
  activities: ActivityType[],
  vocabularies: VocabularyCard[]
): TQuestion | null {
  const vocab = progress.vocabulary;

  if (!vocab) return null;

  const skillActivities = activities.filter((a) => a.skill_code === progress.skill_code);
  if (!skillActivities.length) return null;

  const supportedActivities = skillActivities.filter((a) =>
    [
      "mcq_meaning",
      "mcq_word",
      "listen_choose",
      "listen_type",
      "fill_blank",
      "context_mcq",
      "listen_repeat",
    ].includes(a.code)
  );

  if (!supportedActivities.length) return null;

  const activity = pickRandom<ActivityType>(supportedActivities);
  if (!activity) return null;

  const sameLevelVocabs = vocabularies.filter(
    (v) => v.id !== vocab.id && (!!v.level ? v.level === vocab.level : true)
  );

  switch (activity.code) {
    case "mcq_meaning": {
      if (!vocab.translation) return null;

      const distractors = shuffleArray(
        sameLevelVocabs
          .map((v) => v.translation)
          .filter((t): t is string => !!t && t !== vocab.translation)
      ).slice(0, 3);

      const options = shuffleArray([vocab.translation, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: `What does "${vocab.word}" mean?`,
        options,
        correctAnswer: vocab.translation,
      };
    }

    case "mcq_word": {
      if (!vocab.translation) return null;

      const distractors = shuffleArray(
        sameLevelVocabs.map((v) => v.word).filter((w) => !!w && w !== vocab.word)
      ).slice(0, 3);

      const options = shuffleArray([vocab.word, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: `Which English word means "${vocab.translation}"?`,
        options,
        correctAnswer: vocab.word,
      };
    }

    case "listen_choose": {
      if (!vocab.audio_url) return null;

      const distractors = shuffleArray(
        sameLevelVocabs.map((v) => v.word).filter((w) => !!w && w !== vocab.word)
      ).slice(0, 3);

      const options = shuffleArray([vocab.word, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: "Listen to the audio and choose the correct word:",
        options,
        correctAnswer: vocab.word,
        meta: {
          audioUrl: vocab.audio_url,
        },
      };
    }

    case "listen_type": {
      if (!vocab.audio_url) return null;

      return {
        type: "typing",
        progress,
        activity,
        prompt: "Listen to the audio and type the word you hear:",
        correctAnswer: vocab.word,
        meta: {
          audioUrl: vocab.audio_url,
        },
      };
    }

    case "listen_repeat": {
      if (!vocab.example) return null;

      return {
        type: "speaking",
        progress,
        activity,
        prompt: "Listen to the word and repeat it clearly:",
        meta: {
          sentence: vocab.example,
        },
      };
    }

    case "fill_blank": {
      if (!vocab.example) return null;

      const blanked = buildFillBlankSentence(vocab.example, vocab.word);
      if (!blanked) return null;

      return {
        type: "typing",
        progress,
        activity,
        prompt: "Fill in the blank with the missing word:",
        correctAnswer: vocab.word,
        meta: {
          sentence: blanked,
        },
      };
    }

    case "context_mcq": {
      if (!vocab.example || !vocab.translation) return null;

      const distractors = shuffleArray(
        sameLevelVocabs
          .map((v) => v.translation)
          .filter((t): t is string => !!t && t !== vocab.translation)
      ).slice(0, 3);

      const options = shuffleArray([vocab.translation, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: `In the following sentence, what is the closest meaning of "${vocab.word}"?\n\n${vocab.example}`,
        options,
        correctAnswer: vocab.translation,
      };
    }

    default:
      return null;
  }
}

export function ReviewSession() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dueProgress, setDueProgress] = useState<TProgress[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityType[]>([]);
  const [allVocabularies, setAllVocabularies] = useState<VocabularyCard[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [result, setResult] = useState<ReviewResult>(null);

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

  const loadReviewData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nowIso = new Date().toISOString();

      const [progressRes, activitiesRes] = await Promise.all([
        supabase
          .from("user_vocab_progress")
          .select(
            `
            *,
            vocabulary:vocabularies (*) 
          `
          )
          .or(`next_review_at.lte.${nowIso},next_review_at.is.null`)
          .order("next_review_at", { ascending: true })
          .limit(20),

        supabase
          .from("activity_types")
          .select("id, code, name, skill_code")
          .order("created_at", { ascending: true }),
      ]);

      if (progressRes.error) throw progressRes.error;
      if (activitiesRes.error) throw activitiesRes.error;

      const progressData = (progressRes.data ?? []) as TProgress[];
      const activitiesData = (activitiesRes.data ?? []) as ActivityType[];

      const now = new Date();

      //Get all list of words due date to review
      const dueOnly = progressData.filter((item) => {
        if (!item.next_review_at) return true;
        const nextReviewAt = new Date(item.next_review_at);
        if (Number.isNaN(nextReviewAt.getTime())) return false;
        return nextReviewAt <= now;
      });

      //Map all level have in list of words has to review
      const dueLevels = [
        ...new Set(
          dueOnly
            .map((row) => row.vocabulary?.level)
            .filter((lv): lv is string => typeof lv === "string" && lv.trim().length > 0)
        ),
      ];

      // Unique word_types present in the due list
      const mapWordType = [
        ...new Set(
          dueOnly
            .map((row) => row.vocabulary?.word_type)
            .filter((wt): wt is string => typeof wt === "string" && wt.trim().length > 0)
        ),
      ];

      let vocabData: VocabularyCard[] = [];

      // Base on map of level and word_type to random array of distractor ( to MQC questions)
      if (dueLevels.length > 0 && mapWordType.length > 0) {
        const { data, error } = await supabase.rpc("roll_distractor", {
          p_levels: dueLevels,
          p_limit: 10,
          p_include_word_types: mapWordType,
        });

        if (error) throw error;
        vocabData = (data ?? []) as VocabularyCard[];
      }

      setDueProgress(dueOnly);
      setAllActivities(activitiesData);
      setAllVocabularies(vocabData);
      setSelectedOption(null);
      setTypedAnswer("");
      setResult(null);
      setSessionComplete(false);

      if (dueOnly.length) {
        const firstValid = dueOnly.reduce<{ index: number; question: TQuestion } | null>(
          (acc, item, index) => {
            if (acc) return acc;
            const question = generateQuestion(item, activitiesData, vocabData);
            return question ? { index, question } : null;
          },
          null
        );

        console.log(dueOnly);

        if (firstValid) {
          setCurrentIndex(firstValid.index);
          setCurrentQuestion(firstValid.question);
        } else {
          setCurrentIndex(0);
          setCurrentQuestion(null);
        }
      } else {
        setCurrentIndex(0);
        setCurrentQuestion(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load your review data. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadReviewData();
  }, [loadReviewData]);

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

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || submitting || result) return;

    let isCorrect = false;
    let answerToShow = "";
    let outcome: "answered" | "completed" = "answered";
    let shouldAffectCounts = true;

    if (currentQuestion.type === "mcq") {
      if (!selectedOption) return;
      isCorrect = normalizeToken(selectedOption) === normalizeToken(currentQuestion.correctAnswer);
      answerToShow = currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "typing") {
      if (!typedAnswer.trim()) return;
      isCorrect = normalizeToken(typedAnswer) === normalizeToken(currentQuestion.correctAnswer);
      answerToShow = currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "speaking") {
      isCorrect = false;
      answerToShow = "";
      outcome = "completed";
      shouldAffectCounts = false;
    }

    setSubmitting(true);
    setError(null);

    try {
      const progress = currentQuestion.progress;

      const attemptInsert = await supabase.from("review_attempts").insert({
        vocabulary_id: progress.vocabulary?.id,
        skill_code: progress.skill_code,
        activity_type_id: currentQuestion.activity.id,
        is_correct: isCorrect,
      });

      if (attemptInsert.error) throw attemptInsert.error;

      const nextReviewAt = computeNextReviewDate(progress.correct_count, isCorrect);

      const progressUpdate = await supabase
        .from("user_vocab_progress")
        .update({
          last_reviewed_at: new Date().toISOString(),
          next_review_at: nextReviewAt,
          correct_count:
            shouldAffectCounts && isCorrect ? progress.correct_count + 1 : progress.correct_count,
          wrong_count:
            shouldAffectCounts && !isCorrect ? progress.wrong_count + 1 : progress.wrong_count,
        })
        .eq("id", progress.id);

      if (progressUpdate.error) throw progressUpdate.error;

      if (currentQuestion.type !== "speaking") {
        setResult({
          isCorrect,
          correctAnswer: answerToShow,
          outcome,
        });
      }

      setDueProgress((prev) =>
        prev.map((item, index) =>
          index === currentIndex
            ? {
                ...item,
                last_reviewed_at: new Date().toISOString(),
                next_review_at: nextReviewAt,
                correct_count:
                  shouldAffectCounts && isCorrect ? item.correct_count + 1 : item.correct_count,
                wrong_count:
                  shouldAffectCounts && !isCorrect ? item.wrong_count + 1 : item.wrong_count,
              }
            : item
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save your answer. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [currentIndex, currentQuestion, result, selectedOption, submitting, supabase, typedAnswer]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        Loading your review session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 shadow-sm dark:border-red-500/40 dark:bg-slate-950 dark:shadow-none">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
        <button
          type="button"
          onClick={() => void loadReviewData()}
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
          onClick={() => void loadReviewData()}
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
          onClick={() => void loadReviewData()}
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
          question={currentQuestion}
          result={result}
          setResult={setResult}
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
                onClick={() => void loadReviewData()}
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
