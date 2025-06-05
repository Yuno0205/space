import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { supabase } from "@/lib/supabase/public";
import { VocabularyCard } from "@/types/vocabulary";
import { PostgrestError } from "@supabase/supabase-js";

export const revalidate = 86400;

export default async function VocabularyPage({
  params,
}: {
  params: Promise<{ levelId: string; lessonId: string }>;
}) {
  const { levelId, lessonId } = await params;
  const lvlId = Number(levelId);
  const lesId = Number(lessonId);

  // Bước 1: Lấy mảng vocabulary_id, nhúng lessons(level_id) để có thể filter
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
        <h1>Lỗi khi lấy ID từ lesson_vocabularies</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const vocabIds: string[] = (data ?? []).map((r) => r.vocabulary_id);

  if (vocabIds.length === 0) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Vocabularies in this lesson is empty!</p>
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
    .order("word", { ascending: true });

  if (vocabErr) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Lỗi khi fetch vocabularies</h1>
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
