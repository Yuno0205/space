import { AlphabetCourses } from "@/components/courses/alphabet-courses";

export default function CoursesPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-2">MASTER THE ALPHABET</h1>
      <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
        Interactive courses designed to help you learn the English alphabet through engaging
        exercises and pronunciation practice.
      </p>

      <AlphabetCourses />
    </div>
  );
}
