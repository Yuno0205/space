import { LessonWithProgress, Level } from "@/types/lesson";
import React from "react";
import UnitHeader from "./UnitHeader";
import { LessonNode } from "./LessonNode";

export const LevelSection = React.memo(function LevelSection({
  level,
  lessons,
}: {
  level: Level;
  lessons: LessonWithProgress[];
}) {
  const zigzagOffsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <UnitHeader data={level} />

      <div className="relative flex min-h-[300px] flex-col items-center bg-transparent px-4">
        {lessons.map((lesson, index) => {
          const arrayIndex = index % zigzagOffsets.length;

          const leftOffset = zigzagOffsets[arrayIndex];

          return (
            <div key={lesson.id} className="lesson-node">
              <LessonNode
                left={leftOffset}
                lessonData={{
                  id: lesson.id,
                  letter: lesson.letter,
                  total_words: lesson.total_words,
                  learned_words: lesson.learned_words,
                }}
                levelData={{
                  id: level.id,
                  name: level.name,
                }}
                progress={lesson.progress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
