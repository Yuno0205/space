import { FadeIn } from "@/components/animations/fade-in";
import { VocabularyPractice } from "@/components/English/vocabulary-practice";
import { createClient } from "@/lib/supabase/server";
import next from "next";
import { cookies } from "next/headers";

export default async function VocabularyPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await fetch("/api/flashcards/new");
  const data = await res.json();

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Học Từ Vựng Tiếng Anh</h1>
      </FadeIn>

      <VocabularyPractice />
    </div>
  );
}
