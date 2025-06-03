import { LevelNode } from "./LevelNode";

export function UnitSection() {
  return (
    <div className="w-full">
      <div className="p-4 rounded-xl shadow-md bg-gray-100 dark:bg-[#58CC02] text-whie mb-8 flex flex-col justify-between p-4 gap-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold">Level A1</h2>
        </div>
        <p className="text-sm">This is a level description</p>
      </div>

      {/* Levels Path */}
      <div className="relative flex flex-col items-center space-y-2 min-h-[300px] bg-transparent px-4">
        {[...Array(5)].map((_, index) => (
          <LevelNode key={index} />
        ))}
      </div>
    </div>
  );
}
