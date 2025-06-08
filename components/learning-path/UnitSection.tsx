// /components/learning-path/UnitSection.tsx

"use client"; // <<== THÊM DÒNG NÀY

import { LessonWithProgress, Level } from "@/types/lesson";
import { supabase } from "@/lib/supabase/public";
import { useEffect, useState } from "react";

import { LessonNode } from "./LessonNode";
import UnitHeader from "./UnitHeader";

// Props bây giờ chỉ cần nhận 'level'
export function UnitSection({ level }: { level: Level }) {
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hàm async để tải các lesson cho level này
    const fetchLessons = async () => {
      setLoading(true);
      const { data: fetchedLessons, error: fetchError } = await supabase
        .from("lessons_with_progress")
        .select(
          `
          id, letter, name, description,
          learned_words, total_words, progress
        `
        )
        .eq("level_id", level.id)
        .order("letter", { ascending: true });

      if (fetchError) {
        console.error("Error fetching lessons:", fetchError);
        setError("Error fetching lessons");
      } else {
        setLessons(fetchedLessons || []);
      }
      setLoading(false);
    };

    fetchLessons();
  }, [level.id]); // Chỉ chạy lại khi level.id thay đổi

  // Zigzag offsets for lesson nodes
  const offsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <UnitHeader data={level} />

      {/* LessonMap */}
      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div> // Hiển thị lỗi
        ) : (
          lessons.map((lesson, index) => {
            const arrayIndex = index % offsets.length;
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
          })
        )}
      </div>
    </div>
  );
}
