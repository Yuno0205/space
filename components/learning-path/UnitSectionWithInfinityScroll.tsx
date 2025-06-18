"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { UnitSection } from "./UnitSection";
import { Level } from "@/types/lesson";

interface UnitSectionWithInfinityScrollProps {
  level: Level;
  isLast: boolean;
  onLoadNext: () => void;
  hasMore: boolean;
  loading: boolean;
}

export function UnitSectionWithInfinityScroll({
  level,
  isLast,
  onLoadNext,
  hasMore,
  loading,
}: UnitSectionWithInfinityScrollProps) {
  const loadedRef = useRef(false);

  // Trigger intersection observer ở cuối section này
  const { ref: lastLessonRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false, // Có thể trigger nhiều lần
    rootMargin: "100px", // Trigger sớm hơn 100px
  });

  useEffect(() => {
    // Chỉ load khi:
    // 1. Đây là level cuối cùng được load
    // 2. Last lesson đang in view
    // 3. Vẫn còn data để load
    // 4. Không đang loading
    // 5. Chưa được load trước đó
    if (isLast && inView && hasMore && !loading && !loadedRef.current) {
      loadedRef.current = true;
      onLoadNext();
    }
  }, [isLast, inView, hasMore, loading, onLoadNext]);

  // Reset loaded flag khi không còn là last item
  useEffect(() => {
    if (!isLast) {
      loadedRef.current = false;
    }
  }, [isLast]);

  return (
    <div className="w-full">
      <UnitSection level={level} triggerRef={isLast ? lastLessonRef : undefined} />
    </div>
  );
}
