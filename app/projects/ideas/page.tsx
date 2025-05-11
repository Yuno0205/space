import ComicButton from "@/components/ComicButton";
import { supabaseBrowser as supabase } from "@/lib/supabase/client";

export default async function Ideas() {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      letter,
      name,
      total_words,
      phonetic,
      audio_url,
      completed_words,
      vocabularies: vocabularies (
        id,
        word,
        definition,
        is_learned
      )
    `
    )
    .order("letter", { ascending: true });
  console.log(data);

  if (error) {
    // Consider proper error handling instead of just logging
    // console.error("Error fetching vocabularies:", error.message);
    // Return an error state or fallback UI
    return <div>Failed to load data</div>;
  }

  return (
    <div className="w-full flex items-center justify-center relative z-1 h-[79px]">
      <ComicButton />
    </div>
  );
}
