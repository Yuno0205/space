import { FadeIn } from "@/components/animations/fade-in";
import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function VocabularyPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: voca, error } = await supabase.from("vocabularies").select().limit(100);

  console.log(voca, error);

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Học Từ Vựng Tiếng Anh</h1>
      </FadeIn>

      <VocabularyPractice />
    </div>
  );
}
