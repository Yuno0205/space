"use client";
import { Star, BookOpen, Lock, Trophy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ColorTheme {
  levelActiveBg: string;
  levelCompletedBg: string;
  levelLockedBg: string;
  levelActiveText: string;
  levelCompletedText: string;
  levelLockedText: string;
  text: string; // For general text like labels if needed, or default to white/black
}

export interface LevelNodeProps {
  type: "star" | "book" | "lock" | "chest" | "trophy";
  status: "active" | "completed" | "locked";
  label: string;
  isFirst?: boolean;
  isLast?: boolean;
  colors: ColorTheme; // Nhận schema màu từ UnitSection
  onClick?: () => void;
}

const iconMap = {
  star: Star,
  book: BookOpen,
  lock: Lock,
  trophy: Trophy,
  chest: BookOpen,
};

export function LevelNode({ type, status, label, colors, onClick }: LevelNodeProps) {
  const IconComponent = iconMap[type];

  let bgColor = colors.levelLockedBg;
  let iconColor = colors.levelLockedText;
  let labelColor = "text-gray-500 dark:text-gray-400";
  let showCheckmark = false;
  let pulseAnimation = false;

  if (status === "completed") {
    bgColor = colors.levelCompletedBg;
    iconColor = colors.levelCompletedText;
    labelColor = "text-gray-700 dark:text-gray-200 font-medium";
    showCheckmark = type !== "star"; // Không hiển thị checkmark cho 'star' đã hoàn thành (thường star là điểm bắt đầu/hiện tại)
  } else if (status === "active") {
    bgColor = colors.levelActiveBg;
    iconColor = type === "star" ? colors.levelActiveText : colors.text; // Ngôi sao có màu vàng, các icon khác màu trắng/đen tùy theme
    labelColor = colors.text;
    pulseAnimation = true;
  }

  const nodeSize = type === "star" ? "w-20 h-20 sm:w-24 sm:h-24" : "w-16 h-16 sm:w-20 sm:h-20";
  const iconSize = type === "star" ? "w-8 h-8 sm:w-10 sm:h-10" : "w-6 h-6 sm:w-8 sm:h-8";

  return (
    <div className="flex flex-col items-center group cursor-pointer" onClick={onClick}>
      <motion.div
        className={`relative rounded-full flex items-center justify-center shadow-lg ${nodeSize} ${bgColor} border-4 border-white dark:border-gray-800 transition-all duration-300 ease-in-out group-hover:scale-105`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          pulseAnimation
            ? { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } }
            : {}
        }
      >
        <IconComponent className={`${iconSize} ${iconColor}`} />
        {status === "completed" && showCheckmark && (
          <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-0.5 shadow">
            <Check className={`w-4 h-4 ${colors.levelCompletedText}`} />
          </div>
        )}
      </motion.div>
      {type === "star" && status === "active" && (
        <div
          className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${colors.levelActiveBg} ${colors.text} shadow`}
        >
          {label}
        </div>
      )}
      {type !== "star" && (
        <p className={`mt-2 text-xs sm:text-sm text-center font-medium ${labelColor}`}>{label}</p>
      )}
    </div>
  );
}
