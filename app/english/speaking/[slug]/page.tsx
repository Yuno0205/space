import SpeakingPractice from "@/components/English/speaking-practice";
import { supabase } from "@/lib/supabase/public";

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .ilike("word", `${slug}%`)
    .eq("proficiently->>speaking", "false")
    .order("word", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching data</div>;
  }

  return (
    <main className="container max-w-3xl mx-auto py-10 px-4">
      <SpeakingPractice cards={data || []} slug={slug} />
    </main>
  );
}
