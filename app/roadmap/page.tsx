"use client"; // Cần thiết vì sử dụng hooks

import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { FadeIn } from "@/components/animations/fade-in";
import { UnitSection } from "@/components/learning-path/UnitSection";
import { supabase } from "@/lib/supabase/public";
import { Level } from "@/types/lesson";

export default function LearningHomePage() {
  const [levels, setLevels] = useState<Level[]>([]);
  // 'page' ở đây có thể hiểu là index của level tiếp theo cần tải
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem còn level để tải không

  // Sử dụng useInView hook
  // ref: Gắn vào phần tử cần theo dõi (trigger)
  // inView: Là một boolean (true/false) cho biết phần tử có trong khung nhìn không
  // threshold: 0.5 nghĩa là trigger sẽ kích hoạt khi 50% phần tử hiển thị
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false, // Để nó có thể trigger nhiều lần
  });

  // Hàm để tải một level tiếp theo
  const loadMoreLevels = useCallback(async () => {
    // Nếu đang tải hoặc không còn gì để tải, thì không làm gì cả
    if (loading || !hasMore) return;

    setLoading(true);

    // Tải một level tại vị trí 'page'
    const { data: newLevel, error } = await supabase
      .from("levels")
      .select("*")
      .order("name", { ascending: true })
      .range(page, page) // Chỉ lấy 1 item tại index 'page'
      .single(); // .single() để nhận về 1 object thay vì array

    if (error) {
      console.error("Error fetching level:", error);
      // Nếu lỗi là 'PGRST116' (range not found), nghĩa là đã hết dữ liệu
      if (error.code === "PGRST116") {
        setHasMore(false);
      }
      setLoading(false);
      return;
    }

    if (newLevel) {
      // Thêm level mới vào danh sách
      setLevels((prevLevels) => [...prevLevels, newLevel]);
      // Tăng 'page' lên để lần sau tải level tiếp theo
      setPage((prevPage) => prevPage + 1);
    } else {
      // Nếu không có dữ liệu trả về, nghĩa là đã hết
      setHasMore(false);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  console.log("Levels loaded:", levels.length, "Page:", page, "Has more:", hasMore);

  // Sử dụng useEffect để theo dõi 'inView'
  // Khi phần tử trigger (ref) hiển thị (inView = true), gọi hàm tải thêm
  useEffect(() => {
    if (inView && hasMore) {
      loadMoreLevels();
    }
  }, [inView, hasMore, loadMoreLevels]);

  // useEffect để tải level đầu tiên khi component được mount
  useEffect(() => {
    // Chỉ tải level đầu tiên nếu danh sách đang rỗng
    if (levels.length === 0) {
      loadMoreLevels();
    }
  }, [loadMoreLevels, levels.length]);

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-[url('/assets/images/stars_bg.jpg')] bg-none">
      <FadeIn>
        {levels.map((level: Level, index: number) => (
          <UnitSection key={index} level={level} />
        ))}

        {/* Phần tử trigger sẽ được đặt ở đây */}
        {/* Khi phần tử này cuộn vào màn hình, inView sẽ thành true */}
        {/* Chỉ hiển thị trigger khi còn item để tải và không đang trong quá trình tải */}
        {hasMore && !loading && <div ref={ref} style={{ height: "20px" }} />}

        {/* Hiển thị thông báo đang tải */}
        {loading && <div className="text-center py-4">Đang tải...</div>}

        {/* Hiển thị khi đã tải hết */}
        {!hasMore && levels.length > 0 && (
          <div className="text-center py-4 text-gray-500">Bạn đã xem hết tất cả các mục.</div>
        )}
      </FadeIn>
    </div>
  );
}
