// components/learning-path/types.ts
export interface ColorTheme {
  bgUnitHeader: string; // Màu nền cho header của Unit
  textUnitHeader: string; // Màu chữ cho header của Unit
  guidebookButtonBg: string;
  guidebookButtonHoverBg: string;
  guidebookButtonText: string;

  levelActiveBg: string; // Nền cho node đang active (ví dụ: nút START)
  levelActiveIconText: string; // Màu icon/text cho node đang active (ví dụ: màu ngôi sao)
  levelActiveLabelText: string; // Màu label cho node đang active

  levelCompletedBg: string; // Nền cho node đã hoàn thành
  levelCompletedIconText: string; // Màu icon/checkmark cho node đã hoàn thành
  levelCompletedLabelText: string; // Màu label cho node đã hoàn thành

  levelLockedBg: string; // Nền cho node bị khóa
  levelLockedIconText: string; // Màu icon cho node bị khóa
  levelLockedLabelText: string; // Màu label cho node bị khóa
}

export interface LevelData {
  id: string;
  type: "star" | "book" | "lock" | "chest" | "trophy";
  status: "active" | "completed" | "locked";
  label: string;
  onClick?: () => void;
}

export interface UnitData {
  unitNumber: number;
  title: string;
  description: string;
  colorSchema: "green" | "purple" | "blue" | "orange"; // Key để tra cứu trong colorMap
  levels: LevelData[];
}
