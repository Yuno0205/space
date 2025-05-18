import { FadeIn } from "@/components/animations/fade-in";
import { ListeningPractice } from "@/components/English/listening-practice";

export default function ListeningPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Luyện Nghe Tiếng Anh</h1>
      </FadeIn>

      <ListeningPractice />
    </div>
  );
}
