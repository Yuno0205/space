"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";
import { BookText, Cpu } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import ProgressRing from "./ProgressRing";
import "./styles/style.scss";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-orbitron",
});

interface LessonNodeProps {
  left: number;
  lessonData: {
    id: number;
    letter: string;
    total_words: number;
    learned_words: number;
  };
  levelData: {
    id: number;
    name: string;
  };
  progress?: number;
}

export function LessonNode({ left, lessonData, levelData, progress }: LessonNodeProps) {
  const progressPercentage =
    lessonData.total_words > 0
      ? Math.round((lessonData.learned_words / lessonData.total_words) * 100)
      : 0;

  return (
    <div className="relative flex mt-4" style={{ left: `${left}px` }}>
      <div className="inline-flex cursor-pointer">
        {/* Progress ring */}
        <ProgressRing progress={progress} />

        <div className="m-4 relative">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="node"
                type="button"
                aria-label={`Open lesson ${lessonData.letter} details - ${lessonData.learned_words} of ${lessonData.total_words} words learned`}
              >
                <span className={cn(orbitron.className, "font-bold text-2xl text-white")}>
                  {lessonData.letter ?? ""}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              sideOffset={30}
              avoidCollisions={false}
              className="w-80 border-0 bg-transparent p-0 shadow-none"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm">
                {/* Header with futuristic design */}
                <div className="relative border-b border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20">
                      <Cpu className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className={cn("text-lg font-bold text-white", orbitron.className)}>
                        Lesson {lessonData.letter} - Level {levelData.name}
                      </h3>
                      <p className="text-xs text-white/60 font-mono">
                        {lessonData.total_words} words to master
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content with progress and actions */}
                <div className="p-6 space-y-6">
                  {/* Progress Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white/80">Mission Progress</span>
                      <span className="text-sm font-bold text-white">{progressPercentage}%</span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className="h-2 bg-white/10 [&>div]:bg-white"
                    />
                    <p className="text-xs text-white/50 mt-1 text-right">
                      {lessonData.learned_words} / {lessonData.total_words} words completed
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      className="w-full group relative overflow-hidden justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                      <Link
                        href={`/english/vocabulary/${levelData.name.toLowerCase()}/${lessonData.letter.toLowerCase()}`}
                      >
                        <BookText className="mr-3 h-5 w-5 text-cyan-400" />
                        <span className="relative z-10">Vocabulary Practice</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-0 right-0 h-12 w-12 overflow-hidden">
                  <div className="absolute bottom-0 right-0 h-16 w-16 translate-x-8 translate-y-8 rotate-45 border-l border-t border-white/10"></div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
