import { createClient } from "@/lib/supabase/server";
import { isProficiencyLevel, type ProficiencyLevel } from "@/lib/learning/levels";

export async function getCurrentUserLevel(): Promise<ProficiencyLevel> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("proficiency_level")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(`Failed to load user profile: ${profileError.message}`);
  }

  if (!isProficiencyLevel(profile.proficiency_level)) {
    throw new Error(`Invalid proficiency level: ${profile.proficiency_level}`);
  }

  return profile.proficiency_level;
}
