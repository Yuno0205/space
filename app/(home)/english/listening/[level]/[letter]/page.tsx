import { ListeningPractice } from "@/components/features/English/practice/listening-practice";
import { createClient } from "@/lib/supabase/server";
import { VALID_LEVELS } from "@/types/levels";
import { VocabularyCard } from "@/types/vocabulary";
import { filterUnqualifiedVocabularies } from "@/utils/Supabase/mastery-server";
import { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export default async function DitactionPage({
  params,
}: {
  params: Promise<{
    level: string;
    letter: string;
  }>;
}) {
  const { level, letter } = await params;

  const normalizedLevel = level.toLowerCase();
  const normalizedLetter = letter.toUpperCase();

  const isValidLevel = VALID_LEVELS.includes(normalizedLevel as (typeof VALID_LEVELS)[number]);

  const isValidLetter = /^[A-Z]$/.test(normalizedLetter);

  if (!isValidLevel || !isValidLetter) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: vocabList,
    error,
  }: {
    data: VocabularyCard[] | null;
    error: PostgrestError | null;
  } = await supabase
    .from("vocabularies")
    .select("*")
    .eq("level", normalizedLevel)
    .eq("initial", normalizedLetter)
    .order("word", { ascending: true });

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error fetching vocabularies</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!vocabList || vocabList.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>
          No vocabularies found for Level {normalizedLevel}, Lesson {normalizedLetter}.
        </p>
      </div>
    );
  }

  const learningVocabularies = await filterUnqualifiedVocabularies(vocabList ?? [], "listening");

  return (
    <div className="container mx-auto md:px-4 px-2 md:py-8 py-4">
      <ListeningPractice vocabularies={learningVocabularies} />
    </div>
  );
}
