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
    const currentElement = lastItemRef.current;

    if (!currentElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          void loadMore();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "200px 0px",
      }
    );

    observer.observe(currentElement);

    return () => {
      observer.unobserve(currentElement);
      observer.disconnect();
    };
  }, [items.length, loadMore, hasMore, loading]);

  return lastItemRef;
}
