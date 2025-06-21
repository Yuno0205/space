import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { supabase } from "@/lib/supabase/public";
import { VocabularyCard } from "@/types/vocabulary";
import { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export default async function VocabularyPage({
  params,
}: {
  params: Promise<{ levelId: string; lessonId: string }>;
}) {
  const { levelId, lessonId } = await params;

  const lvlId = Number(levelId);
  const lesId = Number(lessonId);

  if (isNaN(lvlId) || isNaN(lesId)) {
    return notFound();
  }

  // Step 1: Fetch vocabulary_id array, embedding lessons(level_id) for filtering
  const { data, error } = await supabase
    .from("lesson_vocabularies")
    .select(
      `
      vocabulary_id,
      lessons ( level_id )
    `
    )
    .eq("lesson_id", lesId)
    .eq("lessons.level_id", lvlId);

  if (error) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Error fetching vocabulary IDs</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const vocabIds: string[] = (data ?? []).map((r) => r.vocabulary_id);

  if (vocabIds.length === 0) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>No vocabularies found for this lesson.</p>
      </main>
    );
  }

  const {
    data: vocabList,
    error: vocabErr,
  }: { data: VocabularyCard[] | null; error: PostgrestError | null } = await supabase
    .from("vocabularies")
    .select("*")
    .in("id", vocabIds)
    .eq("is_learned", false)
    .order("word", { ascending: true });

  if (vocabErr) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Error fetching vocabularies</h1>
        <p>{vocabErr.message}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-2 sm:px-4">
      <VocabularyPractice vocabularies={vocabList ?? []} />
    </main>
  );
}
