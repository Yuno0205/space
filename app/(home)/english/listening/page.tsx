import { ListeningPractice } from "@/components/features/English/practice/listening-practice";
import { getLearningPathLevels } from "@/lib/learning/levels";
import { getCurrentUserLevel } from "@/lib/learning/user";
import { createClient } from "@/lib/supabase/server";
import { filterUnqualifiedVocabularies } from "@/utils/Supabase/mastery-server";

export default async function ListeningPage() {
  const proficiencyLevel = await getCurrentUserLevel();
  const learningPathLevels = getLearningPathLevels(proficiencyLevel);
  const databaseLevels = learningPathLevels.map((level) => level.toLowerCase());

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
