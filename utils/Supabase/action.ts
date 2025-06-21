import { supabase } from "@/lib/supabase/public";

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

export async function updateCompletedWords(letter: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("completed_words")
    .eq("letter", letter)
    .single();

  if (error) throw error;

  const newCount = (data?.completed_words ?? 0) + 1;

  const { error: updateError } = await supabase
    .from("courses")
    .update({ completed_words: newCount })
    .eq("letter", letter);

  console.log("Updated completed words for course:", letter, "to:", newCount);

  if (updateError) throw updateError;
}
