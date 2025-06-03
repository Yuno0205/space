// components/learning-path/UnitSection.tsx
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LevelNode } from "./LevelNode";

export function UnitSection() {
  return (
    <div className="w-full">
      {/* Unit Header */}
      <div className={`p-4 rounded-xl shadow-md bg-gray-100 dark:bg-gray-800 text-whie mb-8`}>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold">Unit test</h2>
          <Button
            variant="ghost"
            size="sm"
            className={`text-primary flex items-center gap-1 text-sm`}
          >
            <FileText size={16} />
            GUIDEBOOK
          </Button>
        </div>
        <p className="text-sm">Nè mô tả nè</p>
      </div>

      {/* Levels Path */}
      <div className="relative flex flex-col items-center space-y-2 min-h-[300px] bg-transparent px-4">
        <LevelNode />
      </div>
    </div>
  );
}
