// LevelNode.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BookOpen, Bot, Notebook } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import ProgressRing from "./ProgressRing";
import "./styles/style.scss";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-orbitron",
});

interface LevelNodeProps {
  left: number;
  lessonData: {
    id: number;
    letter: string;
  };
  levelData: {
    id: number;
    name: string;
  };
  progress?: number;
}

export function LevelNode({ left, lessonData, levelData, progress }: LevelNodeProps) {
  return (
    <div className="relative flex mt-4 item" style={{ left: `${left}px` }}>
      <div className="inline-flex cursor-pointer">
        {/* Vòng tròn progress */}
        <ProgressRing progress={progress} />

        <div className="m-4 relative">
          <Popover>
            <PopoverTrigger asChild>
              <button className="node" type="button">
                <span className={cn(orbitron.className, "font-bold text-2xl")}>
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
              {/* Chat-like container */}
              <div className="relative">
                {/* Speech bubble tail */}
                <div className="absolute -top-2 left-1/2 h-4 w-4 rotate-45 border-l border-t border-gray-900/20 bg-white dark:border-white/20 dark:bg-black"></div>

                {/* Main chat container */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-900/20 bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] backdrop-blur-sm dark:border-white/20 dark:bg-black dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {/* Circuit pattern background */}
                  <div className="absolute inset-0 opacity-5 ">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_center,_transparent_10%,_#000_10%,_#000_10.5%,_transparent_10.5%,_transparent_20%,_#000_20%,_#000_20.5%,_transparent_20.5%)] bg-[length:15px_15px] dark:bg-[radial-gradient(circle_at_center,_transparent_10%,_#fff_10%,_#fff_10.5%,_transparent_10.5%,_transparent_20%,_#fff_20%,_#fff_20.5%,_transparent_20.5%)]"></div>
                  </div>

                  {/* Header with AI assistant indicator */}
                  <div className="relative border-b border-gray-900/10 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                        <Bot className="h-4 w-4 text-white dark:text-black" />
                      </div>
                      <div>
                        <h3 className="font-mono text-sm font-bold text-gray-900 dark:text-white uppercase">
                          learning progress
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            {progress ? Math.round(progress * 100) : 0}%
                          </span>
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat content */}
                  <div className="relative p-6">
                    {/* Level info */}
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-900/20 bg-gray-50 px-4 py-2 dark:border-white/20 dark:bg-gray-900">
                        <BookOpen className="h-4 w-4 text-gray-900 dark:text-white" />
                        <span
                          className={cn(
                            orbitron.className,
                            "font-bold text-gray-900 dark:text-white"
                          )}
                        >
                          Lesson {lessonData.letter} - Level {levelData.name}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/test/level/${levelData.id}/lesson/${lessonData.id}`}
                        className="w-full"
                      >
                        <Button className="w-full group relative overflow-hidden border border-gray-900 bg-gray-900 font-mono text-white hover:bg-gray-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-black/10"></div>
                          <Notebook className="mr-2 h-4 w-4" />
                          <span className="relative z-10">Learn</span>
                        </Button>
                      </Link>

                      {/* Disabled for now */}
                      {/* <Button className="group relative overflow-hidden border border-gray-900 bg-gray-900 font-mono text-white hover:bg-gray-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-black/10"></div>
                        <Volume2 className="mr-2 h-4 w-4" />
                        <span className="relative z-10">Speak</span>
                      </Button> */}
                    </div>
                  </div>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 right-0 h-8 w-8 overflow-hidden">
                    <div className="absolute bottom-0 right-0 h-12 w-12 translate-x-4 translate-y-4 rotate-45 border-l border-t border-gray-900/20 dark:border-white/20"></div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
