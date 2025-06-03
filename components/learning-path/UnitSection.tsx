// UnitSection.tsx
"use client";
import { LevelNode } from "./LevelNode";

export function UnitSection() {
  // Chuỗi pattern zig-zag (độ dịch sang trái – phải theo px)
  const offsets = [
    0, // index = 0   ←   node i=1,9,17,...
    -44.884, // index = 1   ←   node i=2,10,18,...
    -70, // index = 2   ←   node i=3,11,19,...
    -44.884, // index = 3   ←   node i=4,12,20,...
    0, // index = 4   ←   node i=5,13,21,...
    44.884, // index = 5   ←   node i=6,14,22,...
    70, // index = 6   ←   node i=7,15,23,...
    44.884, // index = 7   ←   node i=8,16,24,...
  ];

  return (
    <div className="w-full">
      {/* Phần header của Unit */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl shadow-md bg-gray-100 dark:bg-[#58CC02] text-white mb-8 flex flex-col justify-between gap-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold">Level A1</h2>
        </div>
        <p className="text-sm">This is a level description</p>
      </div>

      {/* Levels Path */}
      <div className="relative flex flex-col items-center min-h-[300px] bg-transparent px-4">
        {[...Array(20)].map((_, index) => {
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
              label={`A${i}`} // ví dụ nếu bạn hiển thị A1, A2, A3,...
            />
          );
        })}
      </div>
    </div>
  );
}
