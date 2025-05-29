import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { createClient } from "@/lib/supabase/server";
import { VocabularyCard } from "@/types/vocabulary";
import { PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function VocabularyPage() {
  const supabase = createClient(cookies());
  const {
    data: vocabularies,
    error,
  }: { data: VocabularyCard[] | null; error: PostgrestError | null } = await supabase
    .from("vocabularies")
    .select(
      "id, word, phonetic, audio_url, word_type, definition, translation, example, synonyms, antonyms"
    )
    .eq("is_learned", false)
    .order("word", { ascending: true })
    .limit(100);

  if (error) throw new Error(error.message);

  return (
    <div className="container mx-auto py-8 px-2 sm:px-4">
      <VocabularyPractice vocabularies={vocabularies ?? []} />
    </div>
  );
}
