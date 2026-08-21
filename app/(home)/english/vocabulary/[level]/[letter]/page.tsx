import { VocabularyPractice } from "@/components/features/English/practice/vocabulary-practice";
import { createClient } from "@/lib/supabase/server";
import { VocabularyCard } from "@/types/vocabulary";
import { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const VALID_LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;

export default async function VocabularyPage({
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
      <main style={{ padding: "2rem" }}>
        <h1>Error fetching vocabularies</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  if (!vocabList || vocabList.length === 0) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>
          No vocabularies found for Level {normalizedLevel}, Lesson {normalizedLetter}.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-2 py-8 sm:px-4">
      <VocabularyPractice vocabularies={vocabList} />
    </main>
  );
}
