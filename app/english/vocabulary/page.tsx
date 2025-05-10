import { FadeIn } from "@/components/animations/fade-in";
import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function VocabularyPage() {
  const supabase = createClient(cookies());
  const { data: vocabularies, error } = await supabase
    .from("vocabularies")
    .select()
    .eq("is_learned", false)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) throw new Error(error.message);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Học Từ Vựng Tiếng Anh</h1>
      </FadeIn> */}

      <VocabularyPractice />
    </div>
  );
}
