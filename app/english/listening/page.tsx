import { FadeIn } from "@/components/animations/fade-in";
import { ListeningPractice } from "@/components/English/listening-practice";

export default function ListeningPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <ListeningPractice />
      </FadeIn>
    </div>
  );
}
