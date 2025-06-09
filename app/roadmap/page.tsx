"use client";

import { useEffect, useState, useCallback } from "react";
// KHÔNG CẦN DÙNG useInView NỮA
// import { useInView } from "react-intersection-observer";
import { FadeIn } from "@/components/animations/fade-in";
import { UnitSection } from "@/components/learning-path/UnitSection";
import { supabase } from "@/lib/supabase/public";
import { Level } from "@/types/lesson";

export default function LearningHomePage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // KHÔNG CẦN useInView NỮA
  // const { ref, inView } = useInView({...});

  // Hàm loadMoreLevels vẫn giữ nguyên, nó đã hoạt động rất tốt
  const loadMoreLevels = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { data: newLevel, error } = await supabase
      .from("levels")
      .select("*")
      .order("name", { ascending: true })
      .range(page, page)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        setHasMore(false);
      } else {
        console.error("Error fetching level:", error);
      }
    } else if (newLevel) {
      setLevels((prevLevels) => [...prevLevels, newLevel]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  // Vẫn cần useEffect này để tải level đầu tiên khi vào trang
  useEffect(() => {
    if (levels.length === 0) {
      loadMoreLevels();
    }
  }, [loadMoreLevels, levels.length]);

  // KHÔNG CẦN useEffect theo dõi inView NỮA
  // useEffect(() => {
  //   if (inView && hasMore && !loading) {
  //     loadMoreLevels();
  //   }
  // }, [inView, hasMore, loading, loadMoreLevels]);

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-[url('/assets/images/stars_bg.jpg')] bg-none">
      <FadeIn>
        {/* Vẫn render danh sách levels như cũ */}
        {levels.map((level: Level) => (
          <UnitSection key={level.id} level={level} />
        ))}
      </FadeIn>

      {/* ===== PHẦN NÚT LOAD MORE MỚI ===== */}
      <div className="flex justify-center mt-8 mb-4">
        {/* Chỉ hiển thị nút khi không đang tải và vẫn còn level để tải */}
        {!loading && hasMore && (
          <button
            onClick={loadMoreLevels}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Tải thêm
          </button>
        )}

        {/* Hiển thị chỉ báo đang tải */}
        {loading && <div className="text-center py-2 text-gray-500">Đang tải...</div>}

        {/* Hiển thị khi đã tải hết */}
        {!hasMore && levels.length > 0 && (
          <div className="text-center py-2 text-gray-500">Bạn đã xem hết tất cả các mục.</div>
        )}
      </div>
    </div>
  );
}
