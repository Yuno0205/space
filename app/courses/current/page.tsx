import { CourseGrid } from "@/components/Courses/course-grid";
import { Course } from "@/types/course";

const courses: Course[] = [
  {
    name: "Alpha",
    letter: "a",
    phonetic: "æ",
    audio_url: "/audio/a.mp3",
    total_words: 50,
    completed_words: 25,
  },
  {
    name: "Bravo",
    letter: "b",
    phonetic: "bi:",
    audio_url: "/audio/b.mp3",
    total_words: 45,
    completed_words: 10,
  },
  {
    name: "Charlie",
    letter: "c",
    phonetic: "si:",
    audio_url: "/audio/c.mp3",
    total_words: 40,
    completed_words: 20,
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
    completed_words: 30,
  },
  {
    name: "Foxtrot",
    letter: "f",
    phonetic: "ɛf",
    audio_url: "/audio/f.mp3",
    total_words: 48,
    completed_words: 12,
  },
  {
    name: "Golf",
    letter: "g",
    phonetic: "dʒi:",
    audio_url: "/audio/g.mp3",
    total_words: 42,
    completed_words: 21,
  },
  {
    name: "Hotel",
    letter: "h",
    phonetic: "eɪtʃ",
    audio_url: "/audio/h.mp3",
    total_words: 38,
    completed_words: 19,
  },
  {
    name: "India",
    letter: "i",
    phonetic: "aɪ",
    audio_url: "/audio/i.mp3",
    total_words: 36,
    completed_words: 18,
  },
  {
    name: "Juliet",
    letter: "j",
    phonetic: "dʒeɪ",
    audio_url: "/audio/j.mp3",
    total_words: 32,
    completed_words: 16,
  },
  {
    name: "Kilo",
    letter: "k",
    phonetic: "keɪ",
    audio_url: "/audio/k.mp3",
    total_words: 44,
    completed_words: 22,
  },
  {
    name: "Lima",
    letter: "l",
    phonetic: "ɛl",
    audio_url: "/audio/l.mp3",
    total_words: 46,
    completed_words: 23,
  },
  {
    name: "Mike",
    letter: "m",
    phonetic: "ɛm",
    audio_url: "/audio/m.mp3",
    total_words: 50,
    completed_words: 40,
  },
  {
    name: "November",
    letter: "n",
    phonetic: "ɛn",
    audio_url: "/audio/n.mp3",
    total_words: 48,
    completed_words: 24,
  },
  {
    name: "Oscar",
    letter: "o",
    phonetic: "oʊ",
    audio_url: "/audio/o.mp3",
    total_words: 40,
    completed_words: 20,
  },
  {
    name: "Papa",
    letter: "p",
    phonetic: "pi:",
    audio_url: "/audio/p.mp3",
    total_words: 42,
    completed_words: 21,
  },
  {
    name: "Quebec",
    letter: "q",
    phonetic: "kju:",
    audio_url: "/audio/q.mp3",
    total_words: 30,
    completed_words: 15,
  },
  {
    name: "Romeo",
    letter: "r",
    phonetic: "ɑr",
    audio_url: "/audio/r.mp3",
    total_words: 36,
    completed_words: 18,
  },
  {
    name: "Sierra",
    letter: "s",
    phonetic: "ɛs",
    audio_url: "/audio/s.mp3",
    total_words: 44,
    completed_words: 22,
  },
  {
    name: "Tango",
    letter: "t",
    phonetic: "ti:",
    audio_url: "/audio/t.mp3",
    total_words: 38,
    completed_words: 19,
  },
  {
    name: "Uniform",
    letter: "u",
    phonetic: "ju:",
    audio_url: "/audio/u.mp3",
    total_words: 34,
    completed_words: 17,
  },
  {
    name: "Victor",
    letter: "v",
    phonetic: "vi:",
    audio_url: "/audio/v.mp3",
    total_words: 32,
    completed_words: 16,
  },
  {
    name: "Whiskey",
    letter: "w",
    phonetic: "ˈdʌbəl ju:",
    audio_url: "/audio/w.mp3",
    total_words: 30,
    completed_words: 15,
  },
  {
    name: "X-ray",
    letter: "x",
    phonetic: "ɛks",
    audio_url: "/audio/x.mp3",
    total_words: 25,
    completed_words: 10,
  },
];

export default async function CoursesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Alphabet Courses</h1>
      <p className="text-muted-foreground mb-8">
        Master the alphabet with our comprehensive courses. Each letter includes pronunciation
        guides and vocabulary words.
      </p>

      <CourseGrid courses={courses} />
    </div>
  );
}
