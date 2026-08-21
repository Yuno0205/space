import SpeakingPractice from "@/components/features/English/practice/speaking-practice";
import { getLearningPathLevels } from "@/lib/learning/levels";
import { getCurrentUserLevel } from "@/lib/learning/user";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function PronunciationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const phonemeId = Number(id);

  if (Number.isNaN(phonemeId)) {
    notFound();
  }

  const proficiencyLevel = await getCurrentUserLevel();

  if (!proficiencyLevel) {
    redirect("/onboarding");
  }

  // beginner     -> A1, A2
  // intermediate -> A1, A2, B1, B2
  // advanced     -> A1, A2, B1, B2, C1, C2
  const learningPathLevels = getLearningPathLevels(proficiencyLevel);

  // Database currently stores a1, a2, b1...
  const databaseLevels = learningPathLevels.map((level) => level.toLowerCase());

  const supabase = await createClient();

  const { data: phonemeData, error: phonemeError } = await supabase
    .from("phonemes")
    .select("id, symbol")
    .eq("id", phonemeId)
    .single();

  if (phonemeError || !phonemeData) {
    notFound();
  }

  const phoneme = phonemeData.symbol;

  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .in("level", databaseLevels)
    .not("phonetic", "is", null)
    .ilike("phonetic", `%${phoneme}%`)
    .order("word", { ascending: true })
    .limit(50);

  if (error) {
    throw new Error(`Failed to load speaking vocabularies: ${error.message}`);
  }

  return (
    <main className="container max-w-full mx-auto py-10 px-4">
      <SpeakingPractice cards={data ?? []} slug={phoneme} />
    </main>
  );
}
