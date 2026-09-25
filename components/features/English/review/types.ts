import { VocabularyCard } from "@/types/vocabulary";
import { ActivityType, SkillCode } from "@/types/revise";

export type TProgress = {
  id: string;
  skill_code: SkillCode;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  correct_streak: number;
  lapse_count: number;
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

export type ReviewSubmission = {
  isCorrect: boolean;
  answer?: string;
  score?: number;
};

export type ReviewOutcome = {
  isCorrect: boolean;
  score?: number;
};

export type ReviewResult = ReviewOutcome & {
  correctAnswer: string;
  outcome?: "answered" | "completed";
};

export type ReviewFeedback = ReviewOutcome & {
  message: string;
};

export type ReviewSessionData = {
  dueProgress: TProgress[];
  activities: ActivityType[];
  vocabularies: VocabularyCard[];
  initialIndex: number;
  initialQuestion: TQuestion | null;
  loadedAt: string;
};

export const SPEAKING_PASS_SCORE = 85;
