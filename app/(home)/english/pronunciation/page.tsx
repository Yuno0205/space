import { createClient } from "@/lib/supabase/server";
import PronunciationPage from "./_components/pronunciation-page";
import { GroupedPhonemes, Phoneme } from "@/types/pronunciation";

function groupPhonemes(data: Phoneme[]): GroupedPhonemes {
  return data.reduce<GroupedPhonemes>(
    (acc, item) => {
      if (item.type === "vowel") {
        acc.monophthongs.push(item);
      } else if (item.type === "diphthong") {
        acc.diphthongs.push(item);
      } else {
        acc.consonants.push(item);
      }

      return acc;
    },
    {
      monophthongs: [],
      diphthongs: [],
      consonants: [],
    }
  );
}

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("phonemes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Failed to load phonemes: ${error.message}`);
  }

  const phonemes = groupPhonemes((data ?? []) as Phoneme[]);

  return <PronunciationPage phonemes={phonemes} />;
}
