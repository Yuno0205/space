// components/learning-path/UnitSection.tsx
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LevelNode } from "./LevelNode";

export interface LevelData {
  id: string;
  type: "star" | "book" | "lock" | "chest" | "trophy";
  status: "active" | "completed" | "locked";
  label: string;
  onClick?: () => void; // Tùy chọn, nếu bạn muốn xử lý click ở đây
}

export interface UnitData {
  unitNumber: number;
  title: string;
  description: string;
  colorSchema: "green" | "purple" | "blue" | "orange"; // Thêm màu nếu muốn
  levels: LevelData[];
}

interface UnitSectionProps {
  unitData: UnitData;
}

const colorMap = {
  green: {
    bg: "bg-green-500 dark:bg-green-600",
    text: "text-white",
    guidebookButton: "bg-green-400 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400",
    levelActiveBg: "bg-green-500",
    levelCompletedBg: "bg-gray-300 dark:bg-gray-600",
    levelLockedBg: "bg-gray-200 dark:bg-gray-700",
    levelActiveText: "text-yellow-300", // For star icon
    levelCompletedText: "text-green-500", // For checkmark or icon tint
    levelLockedText: "text-gray-400 dark:text-gray-500",
  },
  purple: {
    bg: "bg-purple-500 dark:bg-purple-600",
    text: "text-white",
    guidebookButton:
      "bg-purple-400 hover:bg-purple-300 dark:bg-purple-500 dark:hover:bg-purple-400",
    levelActiveBg: "bg-purple-500",
    levelCompletedBg: "bg-gray-300 dark:bg-gray-600",
    levelLockedBg: "bg-gray-200 dark:bg-gray-700",
    levelActiveText: "text-yellow-300",
    levelCompletedText: "text-purple-500",
    levelLockedText: "text-gray-400 dark:text-gray-500",
  },
  blue: {
    bg: "bg-blue-500 dark:bg-blue-600",
    text: "text-white",
    guidebookButton: "bg-blue-400 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400",
    levelActiveBg: "bg-blue-500",
    levelCompletedBg: "bg-gray-300 dark:bg-gray-600",
    levelLockedBg: "bg-gray-200 dark:bg-gray-700",
    levelActiveText: "text-yellow-300",
    levelCompletedText: "text-blue-500",
    levelLockedText: "text-gray-400 dark:text-gray-500",
  },
  orange: {
    bg: "bg-orange-500 dark:bg-orange-600",
    text: "text-white",
    guidebookButton:
      "bg-orange-400 hover:bg-orange-300 dark:bg-orange-500 dark:hover:bg-orange-400",
    levelActiveBg: "bg-orange-500",
    levelCompletedBg: "bg-gray-300 dark:bg-gray-600",
    levelLockedBg: "bg-gray-200 dark:bg-gray-700",
    levelActiveText: "text-yellow-300",
    levelCompletedText: "text-orange-500",
    levelLockedText: "text-gray-400 dark:text-gray-500",
  },
};

export function UnitSection({ unitData }: UnitSectionProps) {
  const { title, description, levels, colorSchema } = unitData;
  const colors = colorMap[colorSchema] || colorMap.green; // Mặc định là green

  return (
    <div className="w-full">
      {/* Unit Header */}
      <div className={`p-4 rounded-xl shadow-md ${colors.bg} ${colors.text} mb-8`}>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            className={`${colors.guidebookButton} ${colors.text} flex items-center gap-1 text-sm`}
          >
            <FileText size={16} />
            GUIDEBOOK
          </Button>
        </div>
        <p className="text-sm">{description}</p>
      </div>

      {/* Levels Path */}
      <div className="relative flex flex-col items-center space-y-2">
        {/* Đường nối các level (tùy chọn, có thể làm phức tạp) */}
        {/* <div className="absolute top-10 bottom-10 left-1/2 w-1 bg-gray-300 dark:bg-gray-600 -translate-x-1/2 -z-10" /> */}

        {levels.map((level, index) => (
          <LevelNode
            key={level.id}
            type={level.type}
            status={level.status}
            label={level.label}
            isFirst={index === 0}
            isLast={index === levels.length - 1}
            colors={colors} // Truyền schema màu xuống
          />
        ))}
      </div>
    </div>
  );
}
