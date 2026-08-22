import { createClient } from "@/lib/supabase/client";
import { SkillCode } from "@/types/revise";
const supabase = createClient();

export type QualifiableSkillCode = Extract<SkillCode, "recognition" | "speaking" | "listening">;

export async function qualifyVocabSkill(vocabularyId: string, skillCode: QualifiableSkillCode) {
  const { data, error } = await supabase.rpc("qualify_vocab_skill", {
    p_vocabulary_id: vocabularyId,
    p_skill_code: skillCode,
  });

  if (error) {
    console.error("Failed to qualify vocabulary skill:", error);
    throw new Error("Failed to qualify vocabulary skill");
  }

  return data;
}
