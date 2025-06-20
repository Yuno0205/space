"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { supabase } from "@/lib/supabase/public";
import { LessonWithProgress, Level } from "@/types/lesson";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LessonNode } from "./LessonNode";
import "./styles/style.scss";
import UnitHeader from "./UnitHeader";

const LEVELS_PER_PAGE = 1;

interface LevelWithLessons {
  level: Level;
  lessons: LessonWithProgress[];
}

export function InfinityScrollLearningPath() {
  const [levelsData, setLevelsData] = useState<LevelWithLessons[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      try {
        const { data: fetchedData, error: queryError } = await supabase
          .from("levels")
          .select(
            `
            id, name, description,
            lessons:lessons_with_progress(
              id, letter, name, description,
              learned_words, total_words, progress
            )
          `
          )
          .order("name", { ascending: true })
          .order("letter", { foreignTable: "lessons_with_progress", ascending: true })
          .range(page * LEVELS_PER_PAGE, (page + 1) * LEVELS_PER_PAGE - 1);

        if (queryError) throw queryError;

        if (fetchedData && fetchedData.length > 0) {
          // Map lại dữ liệu cho đúng kiểu LevelWithLessons
          const newLevelsWithLessons = fetchedData.map((d) => ({
            level: { id: d.id, name: d.name, description: d.description },
            lessons: d.lessons || [],
          }));

          setLevelsData((prev) =>
            page === 0 ? newLevelsWithLessons : [...prev, ...newLevelsWithLessons]
          );
          setHasMore(fetchedData.length === LEVELS_PER_PAGE);
          setCurrentPage(page + 1);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error loading levels");
      } finally {
        setLoading(false);
      }
    },

    []
  );

  const loadNext = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(currentPage);
    }
  }, [currentPage, loading, hasMore, fetchData]);

  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  if (error && levelsData.length === 0) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <FadeIn>
      {levelsData.map((item, levelIndex) => (
        <LevelSection
          key={item.level.id}
          level={item.level}
          lessons={item.lessons}
          isLastLevel={levelIndex === levelsData.length - 1}
          onLoadNext={loadNext}
          hasMore={hasMore}
        />
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}

      {!hasMore && levelsData.length > 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          🎉 You have reached the end! Great job!
        </div>
      )}
    </FadeIn>
  );
}

// Internal component - không tách file
function LevelSection({
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
    rootMargin: "200px", // Trigger sớm hơn
  });

  // Load next level khi scroll đến lesson cuối
  useEffect(() => {
    if (isLastLevel && inView && hasMore) {
      onLoadNext();
    }
  }, [isLastLevel, inView, hasMore, onLoadNext]);

  // Zigzag offsets
  const offsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <UnitHeader data={level} />

      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {lessons.map((lesson, index) => {
          const i = index + 1;
          const arrayIndex = (i - 1) % offsets.length;
          const leftOffset = offsets[arrayIndex];
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
}
