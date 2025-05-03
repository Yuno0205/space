import { FadeIn } from "@/utils/animations/fade-in";
import { EnglishDashboard } from "@/components/English/english-dashboard";

export default function EnglishPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Học Tiếng Anh</h1>
      </FadeIn>

      <EnglishDashboard />
    </div>
  );
}
