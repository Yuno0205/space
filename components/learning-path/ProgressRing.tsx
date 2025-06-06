import type React from "react";
import { cn } from "@/lib/utils";

// Định nghĩa kiểu cho props của component
interface ProgressRingArcProps {
  progress?: number; // Giá trị từ 0 (0%) đến 1 (100%), mặc định là 0
  size?: number; // Kích thước của SVG (width và height), mặc định là 98
  strokeWidth?: number; // Độ dày của vòng tròn, mặc định là 8
  className?: string; // Class CSS tùy chỉnh cho thẻ svg
}

const ProgressRingArc: React.FC<ProgressRingArcProps> = ({
  progress = 0,
  size = 98,
  strokeWidth = 8,
  className,
}) => {
  // Đảm bảo progress nằm trong khoảng [0, 1]
  const currentProgress = Math.max(0, Math.min(1, progress));

  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - currentProgress);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("progress-ring", className)}
    >
      <g transform="translate(50, 50) rotate(-90)">
        {/* Vòng tròn nền (track) */}
        <circle
          cx="0"
          cy="0"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-300 dark:text-gray-600"
        />
        {/* Vòng tròn tiến độ */}
        {currentProgress > 0 && (
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-gray-800 transition-all duration-500 dark:text-gray-200"
          />
        )}
      </g>
    </svg>
  );
};

export default ProgressRingArc;
