"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Course } from "@/types/course";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface LetterCardProps {
  course: Course;
}

export function LetterCard({ course }: LetterCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressPercentage = Math.round((course.completed_words / course.total_words) * 100) || 0;

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="overflow-hidden border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 cursor-pointer">
      <div className="p-8 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-medium mb-1 text-white">{course.name}</h3>
            <p className="text-zinc-400 text-sm">/{course.phonetic}/</p>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-zinc-700 bg-transparent hover:bg-zinc-800 text-white"
            onClick={toggleAudio}
            aria-label={isPlaying ? "Pause pronunciation" : "Play pronunciation"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
        </div>

        <motion.div
          className="relative flex justify-center items-center hover:scale-105 transition-transform duration-300"
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-[180px] h-[180px] rounded-full bg-zinc-800 hover:scale-110 transition-transform duration-300"
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="relative z-10 text-[140px] font-bold text-white">
            {course.letter.toUpperCase()}
          </span>
        </motion.div>

        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Progress</span>
            <span className="text-sm font-medium text-white">{progressPercentage}%</span>
          </div>

          <div
            className="w-full h-1 bg-zinc-800 overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course completion progress"
          >
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>{course.completed_words} completed</span>
            <span>{course.total_words} total</span>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <Button
          variant="outline"
          className="w-full bg-transparent border border-zinc-700 hover:bg-zinc-800 text-white"
        >
          Continue Learning
        </Button>
      </div>
    </Card>
  );
}
