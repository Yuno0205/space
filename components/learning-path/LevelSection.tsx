import { LessonWithProgress, Level } from "@/types/lesson";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import UnitHeader from "./UnitHeader";
import { LessonNode } from "./LessonNode";

export const LevelSection = React.memo(function LevelSection({
  level,
  lessons,
  isLastLevel,
  onLoadNext,
  hasMore,
}: {
  level: Level;
  lessons: LessonWithProgress[];
  isLastLevel: boolean;
  onLoadNext: () => void;
  hasMore: boolean;
}) {
  // Intersection observer cho lesson cuối cùng
  const { ref: triggerRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "20px", // Trigger sớm hơn
  });

  // Load next level when scrolling to the last lesson
  useEffect(() => {
    if (isLastLevel && inView && hasMore) {
      const handler = setTimeout(() => {
        onLoadNext();
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [isLastLevel, inView, hasMore, onLoadNext]);

  //  ZigzagOffsets
  const ZigzagOffsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <UnitHeader data={level} />

      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {lessons.map((lesson, index) => {
          const i = index + 1;
          const arrayIndex = (i - 1) % ZigzagOffsets.length;
          const leftOffset = ZigzagOffsets[arrayIndex];
          const isLastLesson = index === lessons.length - 1;

          return (
            <div
              key={lesson.id}
              ref={isLastLevel && isLastLesson ? triggerRef : undefined}
              className="lesson-node"
            >
              <LessonNode
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
            </div>
          );
        })}
      </div>
    </div>
  );
});
