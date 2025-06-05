import { LessonWithProgress, Level } from "@/types/lesson";

import { supabaseBrowser } from "@/lib/supabase/client";
import { LessonNode } from "./LessonNode";
import UnitHeader from "./UnitHeader";

export async function UnitSection({ level }: { level: Level }) {
  const { data: lessons, error } = await supabaseBrowser
    .from("lessons_with_progress")
    .select(
      `
      id,
      letter,
      name,
      description,
      learned_words,
      total_words,
      progress
    `
    )
    .eq("level_id", level.id)
    .order("letter", { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return <div>Error fetching lessons</div>;
  }

  // Zigzag offsets for lesson nodes
  const offsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <UnitHeader data={level} />

      {/* LessonMap */}
      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {lessons?.map((lesson: LessonWithProgress, index) => {
          const i = index + 1;
          const arrayIndex = (i - 1) % offsets.length;
          const leftOffset = offsets[arrayIndex];
          return (
            <LessonNode
              key={lesson.id}
              left={leftOffset}
              lessonData={{
                id: lesson.id,
                letter: lesson.letter,
                total_words: lesson.total_words,
                learned_words: lesson.learned_words,
              }}
              levelData={{ id: level.id, name: level.name }}
              progress={lesson.progress}
            />
          );
        })}
      </div>
    </div>
  );
}
