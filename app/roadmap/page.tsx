// app/(main)/page.tsx
import { UnitSection, UnitData } from "@/components/learning-path/UnitSection";

const unitsData: UnitData[] = [
  {
    unitNumber: 1,
    title: "Unit 1",
    description: "Form basic sentences, greet people",
    colorSchema: "green", // 'green' or 'purple' or any other theme
    levels: [
      { id: "1-1", type: "star", status: "active", label: "Start" },
      { id: "1-2", type: "book", status: "completed", label: "Lesson 1" },
      { id: "1-3", type: "lock", status: "locked", label: "Lesson 2" },
      { id: "1-4", type: "chest", status: "locked", label: "Treasure" },
      { id: "1-5", type: "book", status: "locked", label: "Lesson 3" },
      { id: "1-6", type: "trophy", status: "locked", label: "Unit 1 Test" },
    ],
  },
  {
    unitNumber: 2,
    title: "Unit 2",
    description: "Get around in a city",
    colorSchema: "purple",
    levels: [
      { id: "2-1", type: "star", status: "locked", label: "Start" }, // Giả sử Unit 2 chưa được mở
      { id: "2-2", type: "book", status: "locked", label: "Lesson 1" },
      // Thêm các level khác cho Unit 2
    ],
  },
  // Thêm các unit khác nếu cần
];

export default function LearningHomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      {/* Ví dụ vị trí con cú */}
      <div className="w-full max-w-md space-y-12">
        {unitsData.map((unit) => (
          <UnitSection key={unit.unitNumber} unitData={unit} />
        ))}
      </div>
    </div>
  );
}
