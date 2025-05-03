import { FadeIn } from "@/utils/animations/fade-in";
// import { SpeakingPractice } from "@/components/english/speaking-practice"

export default function SpeakingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Luyện Nói Tiếng Anh</h1>
      </FadeIn>

      {/* <SpeakingPractice /> */}
    </div>
  );
}
