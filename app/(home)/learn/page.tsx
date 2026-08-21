import { createClient } from "@/lib/supabase/server";
import { getLearningPathLevels } from "@/lib/learning/levels";
import { getCurrentUserLevel } from "@/lib/learning/user";
import { LearningPath } from "@/components/features/learning-path";

export default async function EnglishPage() {
  const proficiencyLevel = await getCurrentUserLevel();

  const learningPathLevels = getLearningPathLevels(proficiencyLevel);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("levels")
    .select(
      `
      id,
      name,
      description,
      lessons:lessons_with_progress(
        id,
        letter,
        name,
        description,
        learned_words,
        total_words,
        progress
      )
    `
    )
    .in("name", [...learningPathLevels])
    .order("name", { ascending: true })
    .order("letter", {
      referencedTable: "lessons",
      ascending: true,
    });

  if (error) {
    throw new Error(`Failed to load learning path: ${error.message}`);
  }

  return <LearningPath levelsData={data ?? []} />;
}
