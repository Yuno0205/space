"use client";

import { supabase } from "@/lib/supabase/public";
import { VocabularyCard } from "@/types/vocabulary";
import { useCallback, useEffect, useMemo, useState } from "react";

type SkillCode = "flashcard" | "listening" | "reading" | "speaking" | "writing";

type ActivityCode =
  | "mcq_meaning"
  | "mcq_word"
  | "match_word_meaning"
  | "listen_choose"
  | "listen_type"
  | "listen_repeat"
  | "fill_blank"
  | "context_mcq";

type ProgressRow = {
  id: string;
  vocabulary_id: string;
  skill_code: SkillCode;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  correct_count: number;
  wrong_count: number;
  created_at: string;
  updated_at: string;
  vocabulary?: VocabularyCard | null;
};

type ActivityType = {
  id: string;
  code: ActivityCode;
  name: string;
  skill_code: SkillCode;
};

type Question =
  | {
      type: "mcq";
      progress: ProgressRow;
      activity: ActivityType;
      prompt: string;
      options: string[];
      correctAnswer: string;
      meta?: {
        audioUrl?: string | null;
        sentence?: string | null;
      };
    }
  | {
      type: "typing";
      progress: ProgressRow;
      activity: ActivityType;
      prompt: string;
      correctAnswer: string;
      meta?: {
        audioUrl?: string | null;
        sentence?: string | null;
      };
    }
  | {
      type: "speaking";
      progress: ProgressRow;
      activity: ActivityType;
      prompt: string;
      meta?: {
        audioUrl?: string | null;
        sentence?: string | null;
      };
    };

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

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
  progress: ProgressRow,
  activities: ActivityType[],
  vocabularies: VocabularyCard[]
): Question | null {
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

  const activity = pickRandom(supportedActivities);
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
      if (!vocab.audio_url) return null;

      return {
        type: "speaking",
        progress,
        activity,
        prompt: "Listen to the word and repeat it clearly:",

        meta: {
          audioUrl: vocab.audio_url,
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dueProgress, setDueProgress] = useState<ProgressRow[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityType[]>([]);
  const [allVocabularies, setAllVocabularies] = useState<VocabularyCard[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);

  const getNextValidQuestion = useCallback(
    (startIndex: number, progressList: ProgressRow[]) => {
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

  const loadReviewData = async () => {
    setLoading(true);
    setError(null);

    try {
      const nowIso = new Date().toISOString();

      const [progressRes, activitiesRes, vocabRes] = await Promise.all([
        supabase
          .from("user_vocab_progress")
          .select("*")
          .lte("next_review_at", nowIso)
          .order("next_review_at", { ascending: true }),

        supabase
          .from("activity_types")
          .select("id, code, name, skill_code")
          .order("created_at", { ascending: true }),

        supabase.from("vocabularies").select("*"),
      ]);

      if (progressRes.error) throw progressRes.error;
      if (activitiesRes.error) throw activitiesRes.error;
      if (vocabRes.error) throw vocabRes.error;

      const progressData = (progressRes.data ?? []) as unknown as ProgressRow[];
      const activitiesData = (activitiesRes.data ?? []) as ActivityType[];
      const vocabData = (vocabRes.data ?? []) as VocabularyCard[];

      const vocabById = new Map(vocabData.map((v) => [v.id, v]));
      const progressWithVocab: ProgressRow[] = progressData.map((p) => ({
        ...p,
        vocabulary: vocabById.get(p.vocabulary_id) ?? null,
      }));

      const now = new Date();
      const dueOnly = progressWithVocab.filter((item) => {
        if (!item.next_review_at) return true;
        const nextReviewAt = new Date(item.next_review_at);
        if (Number.isNaN(nextReviewAt.getTime())) return false;
        return nextReviewAt <= now;
      });

      setDueProgress(dueOnly);
      setAllActivities(activitiesData);
      setAllVocabularies(vocabData);
      setSelectedOption(null);
      setTypedAnswer("");
      setResult(null);
      setSessionComplete(false);

      if (dueOnly.length) {
        const firstValid = dueOnly.reduce<{ index: number; question: Question } | null>(
          (acc, item, index) => {
            if (acc) return acc;
            const question = generateQuestion(item, activitiesData, vocabData);
            return question ? { index, question } : null;
          },
          null
        );

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
  };

  useEffect(() => {
    void loadReviewData();
  }, []);

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

    if (currentQuestion.type === "mcq") {
      if (!selectedOption) return;
      isCorrect = normalizeText(selectedOption) === normalizeText(currentQuestion.correctAnswer);
    } else if (currentQuestion.type === "typing") {
      if (!typedAnswer.trim()) return;
      isCorrect = normalizeText(typedAnswer) === normalizeText(currentQuestion.correctAnswer);
    } else if (currentQuestion.type === "speaking") {
      isCorrect = true;
    }

    setSubmitting(true);
    setError(null);

    try {
      const progress = currentQuestion.progress;

      const attemptInsert = await supabase.from("review_attempts").insert({
        vocabulary_id: progress.vocabulary_id,
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
          correct_count: isCorrect ? progress.correct_count + 1 : progress.correct_count,
          wrong_count: isCorrect ? progress.wrong_count : progress.wrong_count + 1,
        })
        .eq("id", progress.id);

      if (progressUpdate.error) throw progressUpdate.error;

      setResult({
        isCorrect,
        correctAnswer: currentQuestion.type === "mcq" ? currentQuestion.correctAnswer : "",
      });

      setDueProgress((prev) =>
        prev.map((item, index) =>
          index === currentIndex
            ? {
                ...item,
                last_reviewed_at: new Date().toISOString(),
                next_review_at: nextReviewAt,
                correct_count: isCorrect ? item.correct_count + 1 : item.correct_count,
                wrong_count: isCorrect ? item.wrong_count : item.wrong_count + 1,
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
  }, [currentIndex, currentQuestion, result, selectedOption, submitting, typedAnswer]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200 shadow-sm">
        Loading your review session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-500/50 bg-slate-950 p-4 text-slate-100 shadow-sm">
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={loadReviewData}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dueProgress.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold">No vocabulary is due for review</h2>
        <p className="mt-2 text-sm text-slate-300">
          You don&apos;t have any words scheduled for review right now. Learn some new words or come
          back when your next review is due.
        </p>
      </div>
    );
  }

  //  the session is truly finished
  if (sessionComplete) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold">Session complete! 🎉</h2>
        <p className="mt-2 text-sm text-slate-300">
          You have reviewed all {dueProgress.length} words.
        </p>
        <button
          type="button"
          onClick={loadReviewData}
          className="mt-4 rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Start new session
        </button>
      </div>
    );
  }

  // No valid question can be generated from currently due rows
  if (!currentQuestion) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold">No valid review question is available</h2>
        <p className="mt-2 text-sm text-slate-300">
          Your due words are missing required data for the current activity types. Please refresh
          after updating vocabulary details.
        </p>
        <button
          type="button"
          onClick={loadReviewData}
          className="mt-4 rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Refresh list
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-slate-100">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">
              Question {currentIndex + 1} / {dueProgress.length}
            </p>
            <h2 className="text-xl font-semibold text-slate-50">Vocabulary review</h2>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200">
            {remainingCount} words left
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-sm">
        <h3 className="whitespace-pre-line text-lg font-medium text-slate-50">
          {currentQuestion.prompt}
        </h3>

        {currentQuestion.meta?.sentence ? (
          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-base text-slate-100">
            {currentQuestion.meta.sentence}
          </div>
        ) : null}

        {currentQuestion.meta?.audioUrl ? (
          <div className="mt-4">
            <audio controls src={currentQuestion.meta.audioUrl} className="w-full" />
          </div>
        ) : null}

        {currentQuestion.type === "mcq" ? (
          <div className="mt-6 grid gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              const showCorrect =
                !!result && normalizeText(option) === normalizeText(currentQuestion.correctAnswer);
              const showWrong =
                !!result &&
                isSelected &&
                normalizeText(option) !== normalizeText(currentQuestion.correctAnswer);

              return (
                <button
                  key={option}
                  type="button"
                  disabled={!!result}
                  onClick={() => setSelectedOption(option)}
                  className={[
                    "rounded-xl border px-4 py-3 text-left text-sm transition",
                    isSelected
                      ? "border-slate-100 bg-slate-100/10"
                      : "border-slate-700 bg-slate-900/60",
                    showCorrect ? "border-emerald-400 bg-emerald-500/10" : "",
                    showWrong ? "border-red-400 bg-red-500/10" : "",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6">
            <input
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              disabled={!!result}
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-100"
            />
          </div>
        )}

        {!result ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitting ||
                (currentQuestion.type === "mcq" ? !selectedOption : !typedAnswer.trim())
              }
              className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-white disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Check answer"}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div
              className={[
                "rounded-xl p-4 text-sm",
                result.isCorrect
                  ? "border border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                  : "border border-red-400/60 bg-red-500/10 text-red-200",
              ].join(" ")}
            >
              {result.isCorrect
                ? "Correct!"
                : `Not quite. The correct answer is: ${result.correctAnswer}`}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToNextQuestion}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                {currentIndex + 1 >= dueProgress.length ? "Finish session" : "Next question"}
              </button>

              <button
                type="button"
                onClick={loadReviewData}
                className="rounded-xl border border-slate-600 px-5 py-3 text-sm text-slate-100 hover:border-slate-400"
              >
                Refresh list
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Show word details only after a wrong answer to support learning without spoiling beforehand */}
      {!result || result.isCorrect
        ? null
        : (() => {
            const vocab = currentQuestion.progress.vocabulary;
            if (!vocab) return null;

            return (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-100 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-50">Word details</h4>
                <div className="mt-3 space-y-1 text-slate-200">
                  <p>
                    <span className="font-medium text-slate-100">Word:</span> {vocab.word}
                    {vocab.phonetic ? (
                      <span className="ml-2 text-slate-400">/{vocab.phonetic}/</span>
                    ) : null}
                  </p>
                  {vocab.translation ? (
                    <p>
                      <span className="font-medium text-slate-100">Translation:</span>{" "}
                      {vocab.translation}
                    </p>
                  ) : null}
                  {vocab.definition ? (
                    <p>
                      <span className="font-medium text-slate-100">Definition:</span>{" "}
                      {vocab.definition}
                    </p>
                  ) : null}
                  {vocab.example ? (
                    <p>
                      <span className="font-medium text-slate-100">Example:</span>{" "}
                      <span className="italic">{vocab.example}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })()}
    </div>
  );
}
