import { Course } from "@/types/course";
import { LetterCard } from "./letter-card";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export const demoAlphabetCourses: Course[] = [
  {
    name: "Alpha",
    letter: "a",
    phonetic: "æ",
    audio_url: "/audio/a.mp3",
    total_words: 50,
    completed_words: 35,
  },
  {
    name: "Bravo",
    letter: "b",
    phonetic: "bi:",
    audio_url: "/audio/b.mp3",
    total_words: 45,
    completed_words: 20,
  },
  {
    name: "Charlie",
    letter: "c",
    phonetic: "si:",
    audio_url: "/audio/c.mp3",
    total_words: 40,
    completed_words: 40,
  },
  {
    name: "Delta",
    letter: "d",
    phonetic: "di:",
    audio_url: "/audio/d.mp3",
    total_words: 35,
    completed_words: 15,
  },
  {
    name: "Echo",
    letter: "e",
    phonetic: "i:",
    audio_url: "/audio/e.mp3",
    total_words: 30,
    completed_words: 25,
  },
  {
    name: "Foxtrot",
    letter: "f",
    phonetic: "ɛf",
    audio_url: "/audio/f.mp3",
    total_words: 48,
    completed_words: 12,
  },
];
export async function AlphabetCourses() {
  const { data, error } = await supabaseBrowser.from("courses").select().limit(6).order("letter", {
    ascending: true,
  });

  if (error) {
    console.error("Error fetching courses:", error);
    return <div>Error loading courses</div>;
  }
  console.log(data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((course) => (
        <Link href={`/english/speaking/${course.letter}`} key={course.id}>
          <LetterCard course={course} />
        </Link>
      ))}
    </div>
  );
}
