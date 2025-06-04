// UnitSection.tsx
"use client";
import { Level } from "@/types/lesson";
import LevelCard from "./LevelCard";
import { LevelNode } from "./LevelNode";

export function UnitSection({ level }: { level: Level }) {
  // Chuỗi pattern zig-zag (độ dịch sang trái – phải theo px)
  const offsets = [0, -44.884, -70, -44.884, 0, 44.884, 70, 44.884, 0];

  return (
    <div className="w-full">
      <LevelCard />

      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {[...Array(5)].map((_, index) => {
          // index chạy từ 0 → 19, nhưng node của chúng ta đánh số i = index+1
          const i = index + 1;
          // Tính arrayIndex = (i – 1) % 8
          const arrayIndex = (i - 1) % offsets.length;
          // Lấy giá trị dịch ngang từ mảng offsets
          const leftOffset = offsets[arrayIndex];

          return (
            <LevelNode
              key={index}
              left={leftOffset}
              label={`B`} // ví dụ nếu bạn hiển thị A1, A2, A3,...
            />
          );
        })}
      </div>
    </div>
  );
}
