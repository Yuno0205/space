import React from "react";
import { cn } from "@/lib/utils";

// Định nghĩa kiểu cho props của component
interface ProgressRingArcProps {
  progress?: number; // Giá trị từ 0 (0%) đến 1 (100%), mặc định là 0
  size?: number; // Kích thước của SVG (width và height), mặc định là 98
  trackColor?: string; // Màu của rãnh nền, mặc định là rgb(var(--color-swan))
  progressColor?: string; // Màu của phần vòng tròn thể hiện tiến độ, mặc định là màu vàng
  strokeWidth?: number; // Độ dày của vòng tròn, mặc định là 8
  className?: string; // Class CSS tùy chỉnh cho thẻ svg
}

const ProgressRingArc: React.FC<ProgressRingArcProps> = ({
  progress = 0,
  size = 98,
  trackColor = "rgb(var(--color-swan))", // <-- Đã cập nhật lại màu mặc định
  progressColor = "white",
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
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Vòng tròn tiến độ */}
        {currentProgress > 0 && (
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
};

export default ProgressRingArc;
