import { FadeIn } from "@/components/animations/fade-in";
import { AlphabetCourses } from "@/components/courses/alphabet-courses";

export default async function SpeakingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Luyện Nói Tiếng Anh</h1>
      </FadeIn>

      <AlphabetCourses />
    </div>
  );
}
