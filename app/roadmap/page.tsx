import { FadeIn } from "@/components/animations/fade-in";
import { UnitSection } from "@/components/learning-path/UnitSection";

export default function LearningHomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <UnitSection />
      </FadeIn>
    </div>
  );
}
