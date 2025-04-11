import { FadeIn } from "@/components/animations/fade-in";
// import { WritingPractice } from "@/components/english/writing-practice"

export default function WritingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Luyện Viết Tiếng Anh</h1>
      </FadeIn>

      {/* <WritingPractice /> */}
    </div>
  );
}
