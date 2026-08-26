import { ListeningPractice } from "@/components/features/English/practice/listening-practice";
import { getCurrentLevels, isProficiencyLevel } from "@/lib/learning/levels";
import { createClient } from "@/lib/supabase/server";
import { filterUnqualifiedVocabularies } from "@/utils/Supabase/mastery-server";
import { notFound } from "next/navigation";

export default async function ListeningLevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isProficiencyLevel(slug)) {
    notFound();
  }

  const databaseLevels = getCurrentLevels(slug).map((level) => level.toLowerCase());
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .in("level", databaseLevels)
    .order("word", { ascending: true })
    .limit(50);

  if (error) {
    throw new Error(`Failed to load listening vocabularies: ${error.message}`);
  }

  const learningVocabularies = await filterUnqualifiedVocabularies(data ?? [], "listening");

  return (
    <main className="container mx-auto px-2 py-8 sm:px-4">
      <ListeningPractice vocabularies={learningVocabularies ?? []} />
    </main>
  );
}
