import { FadeIn } from "@/components/animations/fade-in";
import { ListeningPractice } from "@/components/English/features/listening-practice";

const myVocabularies = [
  {
    id: 1,
    word: "diligent",
    phonetic: "/ˈdɪlɪdʒənt/",
    audio: "/audio/diligent.mp3", // Tùy chọn
    wordtype: "adjective",
    definition: "working hard and carefully",
    translation: "siêng năng, cần cù",
    example: "She is very diligent in her work.",
  },
  {
    id: 2,
    word: "efficient",
    phonetic: "/ɪˈfɪʃənt/",
    audio: "/audio/efficient.mp3",
    wordtype: "adjective",
    definition: "working well without wasting time or energy",
    translation: "hiệu quả",
    example: "The new system is more efficient.",
  },
  // ... thêm các từ vựng khác
];

export default function ListeningPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <ListeningPractice vocabularies={myVocabularies} />
      </FadeIn>
    </div>
  );
}
