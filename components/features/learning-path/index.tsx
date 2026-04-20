"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { LessonWithProgress, Level } from "@/types/lesson";
import { useCallback, useEffect, useRef, useState } from "react";
import "./styles/style.scss";
import { LevelSection } from "./LevelSection";
import { createClient } from "@/lib/supabase/client";

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

  const isFetchingRef = useRef(false);
  const supabase = createClient();

  const fetchData = useCallback(
    async (page: number) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
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

        if (!fetchedData || fetchedData.length === 0) {
          setHasMore(false);
          return;
        }

        const newLevelsWithLessons: LevelWithLessons[] = fetchedData.map((d) => ({
          level: {
            id: d.id,
            name: d.name,
            description: d.description,
          },
          lessons: d.lessons || [],
        }));

        setLevelsData((prev) =>
          page === 0 ? newLevelsWithLessons : [...prev, ...newLevelsWithLessons]
        );
        setHasMore(fetchedData.length === LEVELS_PER_PAGE);
        setCurrentPage(page + 1);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error loading levels");
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [supabase]
  );

  const loadNext = useCallback(() => {
    if (!hasMore) return;
    void fetchData(currentPage);
  }, [currentPage, hasMore, fetchData]);

  useEffect(() => {
    void fetchData(0);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
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
