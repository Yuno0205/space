import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function VocabularyPage() {
  const supabase = createClient(cookies());
  const { data: vocabularies, error } = await supabase
    .from("vocabularies")
    .select(
      "id, word, phonetic,audio_url, word_type, definition, translation ,example ,synonyms , antonyms"
    )
    .eq("is_learned", false)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) throw new Error(error.message);

  // const vocabularies = data.map((row) => ({
  //   ...row,
  //   synonyms: row.synonyms
  //     .split(",") // tách theo dấu phẩy
  //     .map((s: string) => s.trim()), // bỏ khoảng trắng thừa
  //   antonyms: row.antonyms.split(",").map((s: string) => s.trim()),
  // }));

  const handleKnown = async (id: string) => {
    await supabase.from("vocabularies").update({ is_learned: true }).eq("id", id);
    await supabase.from("review_queue").upsert({
      vocab_id: id,
      repetition_count: 1,
      interval_days: 1,
      easiness_factor: 2.5,
      next_review: new Date(Date.now() + 86400000).toISOString(),
    });
  };

  console.log("vocabularies", vocabularies);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Học Từ Vựng Tiếng Anh</h1>
      </FadeIn> */}

      <VocabularyPractice vocabularies={vocabularies} />
    </div>
  );
}
