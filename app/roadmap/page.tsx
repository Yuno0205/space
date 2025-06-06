import { FadeIn } from "@/components/animations/fade-in";
import { UnitSection } from "@/components/learning-path/UnitSection";
import { supabase } from "@/lib/supabase/public";
import { Level } from "@/types/lesson";

export const revalidate = 3600;

export default async function LearningHomePage() {
  const { data: levels, error } = await supabase
    .from("levels")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching levels:", error);
    return <div>Error loading levels</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-[url('/assets/images/stars_bg.jpg')] bg-none">
      <FadeIn>
        {levels && levels.length > 0
          ? levels.map((level: Level) => <UnitSection key={level.id} level={level} />)
          : null}
      </FadeIn>
    </div>
  );
}
