import "server-only";

import { createClient } from "@/lib/supabase/server";
import { VocabularyCard } from "@/types/vocabulary";
import { ActivityType } from "@/types/revise";

import { ReviewSessionData, TProgress, TQuestion } from "../types";
import { generateQuestion } from "./question-generator";

export async function getReviewSessionData(): Promise<ReviewSessionData> {
  const supabase = await createClient();

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

  if (progressRes.error) {
    throw progressRes.error;
  }

  if (activitiesRes.error) {
    throw activitiesRes.error;
  }

  const progressData = (progressRes.data ?? []) as TProgress[];
  const activitiesData = (activitiesRes.data ?? []) as ActivityType[];

  const now = new Date();

  const dueOnly = progressData.filter((item) => {
    if (!item.next_review_at) return true;

    const nextReviewAt = new Date(item.next_review_at);

    if (Number.isNaN(nextReviewAt.getTime())) {
      return false;
    }

    return nextReviewAt <= now;
  });

  const dueLevels = [
    ...new Set(
      dueOnly
        .map((row) => row.vocabulary?.level)
        .filter((level): level is string => typeof level === "string" && level.trim().length > 0)
    ),
  ];

  const wordTypes = [
    ...new Set(
      dueOnly
        .map((row) => row.vocabulary?.word_type)
        .filter(
          (wordType): wordType is string =>
            typeof wordType === "string" && wordType.trim().length > 0
        )
    ),
  ];

  let vocabData: VocabularyCard[] = [];

  if (dueLevels.length > 0 && wordTypes.length > 0) {
    const { data, error } = await supabase.rpc("roll_distractor", {
      p_levels: dueLevels,
      p_limit: 10,
      p_include_word_types: wordTypes,
    });

    if (error) {
      throw error;
    }

    vocabData = (data ?? []) as VocabularyCard[];
  }

  const firstValid = dueOnly.reduce<{
    index: number;
    question: TQuestion;
  } | null>((acc, item, index) => {
    if (acc) return acc;

    const question = generateQuestion(item, activitiesData, vocabData);

    return question
      ? {
          index,
          question,
        }
      : null;
  }, null);

  return {
    dueProgress: dueOnly,
    activities: activitiesData,
    vocabularies: vocabData,
    initialIndex: firstValid?.index ?? 0,
    initialQuestion: firstValid?.question ?? null,

    // dùng để force remount khi router.refresh()
    loadedAt: new Date().toISOString(),
  };
}
