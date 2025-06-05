import { LessonWithProgress, Level } from "@/types/lesson";
import LevelCard from "./LevelCard";
import { LevelNode } from "./LevelNode";
import { supabaseBrowser } from "@/lib/supabase/client";

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

  // Chuỗi pattern zig-zag (độ dịch sang trái – phải theo px)
  const offsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <LevelCard data={level} />

      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {lessons?.map((lesson: LessonWithProgress, index) => {
          const i = index + 1;
          const arrayIndex = (i - 1) % offsets.length;
          const leftOffset = offsets[arrayIndex];
          return (
            <LevelNode
              key={lesson.id}
              left={leftOffset}
              lessonData={{ id: lesson.id, letter: lesson.letter }}
              levelData={{ id: level.id, name: level.name }}
              progress={lesson.progress}
            />
          );
        })}
      </div>
    </div>
  );
}
