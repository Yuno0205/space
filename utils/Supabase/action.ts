import { supabaseBrowser as supabase } from "@/lib/supabase/client";

export async function updateProficiency(vocabId: string, key: string, value: boolean) {
  const { error } = await supabase.rpc("update_proficiently_field", {
    p_vocab_id: vocabId,
    p_key: key,
    p_value: value,
  });

  if (error) {
    console.error("Error updating proficiency:", error);
    throw error;
  }
}
