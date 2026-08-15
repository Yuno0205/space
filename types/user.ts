export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;

  proficiency_level: ProficiencyLevel | null;
  daily_new_words_goal: number | null;
  daily_minutes_goal: number | null;

  onboarding_completed_at: string | null;

  created_at: string;
  updated_at: string;
};
