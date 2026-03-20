import SpeakingPractice from "@/components/English/features/speaking-practice";
import { supabase } from "@/lib/supabase/public";

export default async function SpeakingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const phonemeId = Number(id);

  const { data: phonemeData, error: phonemeError } = await supabase
    .from("phonemes")
    .select("*")
    .eq("id", phonemeId)
    .single();

  if (phonemeError || !phonemeData) {
    console.error("Error fetching phoneme:", phonemeError);
    return <div>Phoneme not found</div>;
  }

  const phoneme = phonemeData.symbol;

  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .not("phonetic", "is", null)
    .ilike("phonetic", `%${phoneme}%`)
    .eq("proficiently->>speaking", "false")
    .order("word", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching data</div>;
  }

  return (
    <main className="container max-w-3xl mx-auto py-10 px-4">
      <SpeakingPractice cards={data || []} slug={phoneme} />
    </main>
  );
}
