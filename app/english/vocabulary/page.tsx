import { FadeIn } from "@/utils/animations/fade-in";
import { VocabularyPractice } from "@/components/English/vocabulary-practice";

export default function VocabularyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Học Từ Vựng Tiếng Anh</h1>
      </FadeIn>

      <VocabularyPractice />
    </div>
  );
}
