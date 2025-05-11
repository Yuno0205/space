"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause } from "lucide-react";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progressPercentage = Math.round((course.completed_words / course.total_words) * 100);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(course.audio_url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-primary">{course.letter.toUpperCase()}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleAudio}
                aria-label={isPlaying ? "Pause pronunciation" : "Play pronunciation"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
            </div>
            <h3 className="text-xl font-semibold mt-3">{course.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">/{course.phonetic}/</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1.5">
            <span>Progress</span>
            <span>
              {course.completed_words}/{course.total_words} words
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardFooter>
    </Card>
  );
}
