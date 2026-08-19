import type { ProficiencyLevel } from "@/lib/learning/levels";
import { createClient } from "../supabase/server";

export async function getCurrentUserLevel(): Promise<ProficiencyLevel | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("proficiency_level")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return profile.proficiency_level as ProficiencyLevel;
}
