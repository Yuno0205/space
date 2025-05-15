import SpeakingPractice from "@/components/english/speaking-practice";
import { supabaseBrowser as supabase } from "@/lib/supabase/client";

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .ilike("word", `${slug}%`)
    .eq("proficiently->>speaking", "false")
    .limit(10);

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
