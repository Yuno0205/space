"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Course } from "@/types/course";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react"; // Chỉ cần import Volume2
import Link from "next/link";
import React, { useEffect, useRef } from "react"; // Bỏ useState

interface LetterCardProps {
  course: Course;
}

export function LetterCard({ course }: LetterCardProps) {
  // Bỏ useState isPlaying
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressPercentage = Math.round((course.completed_words / course.total_words) * 100) || 0;

  useEffect(() => {
    if (course.audio_url) {
      const audio = new Audio(course.audio_url);
      // Không cần xử lý onended để thay đổi state icon nữa
      // audio.onended = () => { /* Có thể log hoặc làm gì đó nếu cần khi kết thúc */ };
      audio.onerror = () => {
        console.error(`Failed to load audio: ${course.audio_url}`);
      };
      audioRef.current = audio;
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [course.audio_url]);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      console.warn("Audio reference is not available.");
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error(`Error playing audio: ${course.audio_url}`, error);
    });
  };

  return (
    <Card className="overflow-hidden border border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
      <div className="p-8 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-medium mb-1 dark:text-white">{course.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-zinc-400 text-sm">{course.phonetic}</p>
            </div>
          </div>

          {course.audio_url && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-zinc-700 bg-transparent dark:hover:bg-zinc-800  dark:text-white"
              onClick={handlePlayAudio}
              aria-label="Phát âm" // aria-label cố định
            >
              <Volume2 size={18} /> {/* Luôn là icon Volume2 */}
            </Button>
          )}
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
            <span className="text-sm font-medium dark:text-white">{progressPercentage}%</span>
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
          className="w-full bg-transparent border border-zinc-700 dark:text-white  hover:text-zinc-900 transition-colors duration-200"
          asChild
        >
          <Link href={`/english/speaking/${course.letter}`}>Continue Learning</Link>
        </Button>
      </div>
    </Card>
  );
}
