import { FadeIn } from "@/components/animations/fade-in";
// import { ReadingPractice } from "@/components/english/reading-practice"

export default function ReadingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Luyện Đọc Tiếng Anh</h1>
      </FadeIn>

      {/* <ReadingPractice /> */}
    </div>
  );
}
