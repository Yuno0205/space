"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ end, duration = 2, delay = 0, prefix = "", suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);

  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  useEffect(() => {
    if (!isInView || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    let animationFrame: number | undefined;
    let startTime: number | undefined;

    const delayTimeout = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTime === undefined) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;

        const progress = Math.min(elapsed / (duration * 1000), 1);

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      window.clearTimeout(delayTimeout);

      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
