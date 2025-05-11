"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import type { Course } from "@/types/course";

interface LetterCardProps {
  course: Course;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export function LetterCard({ course, isHovered, onHover, onLeave }: LetterCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressPercentage = Math.round((course.completed_words / course.total_words) * 100);

  useEffect(() => {
    if (!audioRef.current && course.audio_url) {
      audioRef.current = new Audio(course.audio_url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [course.audio_url]);

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
    <Card
      className="overflow-hidden border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
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
          className="relative flex justify-center items-center"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-[180px] h-[180px] rounded-full bg-zinc-800"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
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

          <div className="w-full h-1 bg-zinc-800 overflow-hidden">
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
