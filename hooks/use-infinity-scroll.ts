"use client";
import { useEffect, useRef } from "react";

export function useInfinityScroll<T>(
  items: T[],
  loadMore: () => Promise<void>,
  hasMore: boolean,
  loading: boolean
) {
  const lastItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "200px 0px",
      }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [loadMore, hasMore, loading]);

  return lastItemRef;
}
