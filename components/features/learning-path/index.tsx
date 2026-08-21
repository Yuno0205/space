"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { LessonWithProgress, Level } from "@/types/lesson";
import "./styles/style.scss";
import { LevelSection } from "./LevelSection";

interface LevelWithLessons {
  level: Level;
  lessons: LessonWithProgress[];
}

interface LearningPathProps {
  levelsData: {
    id: number;
    name: string;
    description: string | null;
    lessons: LessonWithProgress[];
  }[];
}

export function LearningPath({ levelsData }: LearningPathProps) {
  const formattedLevels: LevelWithLessons[] = levelsData.map((item) => ({
    level: {
      id: item.id,
      name: item.name,
      description: item.description ?? undefined,
    },
    lessons: item.lessons ?? [],
  }));

  return (
    <FadeIn>
      {formattedLevels.map((item) => (
        <LevelSection key={item.level.id} level={item.level} lessons={item.lessons} />
      ))}

      {formattedLevels.length === 0 && (
        <div className="py-8 text-center text-gray-600 dark:text-gray-400">
          No levels available for your current level.
        </div>
      )}
    </FadeIn>
  );
}
