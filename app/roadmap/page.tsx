import { FadeIn } from "@/components/animations/fade-in";
import { UnitSection } from "@/components/learning-path/UnitSection";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Level } from "@/types/lesson";
import { PostgrestError } from "@supabase/supabase-js";

const revalidate = 3600;

export default async function LearningHomePage() {
  const { data, error } = await supabaseBrowser
    .from("levels")
    .select(
      `
      id,
      name,
      description,
      lessons (
        id,
        letter,
        name,
        description
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching levels:", error);
    return <div>Error loading levels</div>;
  }

  console.log("Fetched levels:", data);

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-[url('/assets/images/stars_bg.jpg')] bg-none">
      <FadeIn>
        {data && data.length > 0
          ? data.map((level: Level) => <UnitSection key={level.id} level={level} />)
          : null}
      </FadeIn>
    </div>
  );
}
