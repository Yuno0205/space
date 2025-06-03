// components/learning-path/colorMap.ts
import type { ColorTheme } from "./types";

export const colorMap: Record<string, ColorTheme> = {
  green: {
    bgUnitHeader: "bg-green-500 dark:bg-green-600",
    textUnitHeader: "text-white",
    guidebookButtonBg: "bg-green-100 dark:bg-green-400",
    guidebookButtonHoverBg: "hover:bg-green-200 dark:hover:bg-green-500",
    guidebookButtonText: "text-green-700 dark:text-green-900",

    levelActiveBg: "bg-green-500 dark:bg-green-600",
    levelActiveIconText: "text-yellow-300", // Màu cho ngôi sao
    levelActiveLabelText: "text-white",

    levelCompletedBg: "bg-gray-200 dark:bg-gray-500",
    levelCompletedIconText: "text-green-600 dark:text-green-400",
    levelCompletedLabelText: "text-gray-700 dark:text-gray-300",

    levelLockedBg: "bg-gray-100 dark:bg-gray-700",
    levelLockedIconText: "text-gray-400 dark:text-gray-500",
    levelLockedLabelText: "text-gray-400 dark:text-gray-500",
  },
  purple: {
    bgUnitHeader: "bg-purple-500 dark:bg-purple-600",
    textUnitHeader: "text-white",
    guidebookButtonBg: "bg-purple-100 dark:bg-purple-400",
    guidebookButtonHoverBg: "hover:bg-purple-200 dark:hover:bg-purple-500",
    guidebookButtonText: "text-purple-700 dark:text-purple-900",

    levelActiveBg: "bg-purple-500 dark:bg-purple-600",
    levelActiveIconText: "text-yellow-300",
    levelActiveLabelText: "text-white",

    levelCompletedBg: "bg-gray-200 dark:bg-gray-500",
    levelCompletedIconText: "text-purple-600 dark:text-purple-400",
    levelCompletedLabelText: "text-gray-700 dark:text-gray-300",

    levelLockedBg: "bg-gray-100 dark:bg-gray-700",
    levelLockedIconText: "text-gray-400 dark:text-gray-500",
    levelLockedLabelText: "text-gray-400 dark:text-gray-500",
  },
  // Bạn có thể thêm các schema màu khác (blue, orange,...) tương tự
};
