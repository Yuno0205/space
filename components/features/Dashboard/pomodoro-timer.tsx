"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Coffee } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "break";

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed
            clearInterval(intervalRef.current as NodeJS.Timeout);

            // Switch modes
            if (mode === "focus") {
              setSessions((prev) => prev + 1);
              setMode("break");
              return breakTime;
            } else {
              setMode("focus");
              return focusTime;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, mode, focusTime, breakTime]); // Added focusTime and breakTime to dependency array

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setTimeLeft(focusTime);
    // Optionally reset sessions count if desired:
    // setSessions(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const total = mode === "focus" ? focusTime : breakTime;
    if (total === 0) return 0; // Avoid division by zero
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card
        className={cn(
          "overflow-hidden",
          mode === "focus" ? "border-white/20" : "border-green-500/20"
        )}
      >
        <CardHeader
          className={cn(
            "pb-2",
            mode === "focus"
              ? "bg-gradient-to-r from-white/5 to-transparent"
              : "bg-gradient-to-r from-green-500/5 to-transparent"
          )}
        >
          <CardTitle className="flex items-center justify-between">
            <span>Pomodoro Timer</span>
            <span className="text-sm font-normal text-gray-400">{sessions} sessions completed</span>
          </CardTitle>
          <CardDescription>
            {mode === "focus" ? "Focus on your work" : "Take a short break"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  key={`${mode}-${isActive}`} // Key helps Framer Motion re-animate on change
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-bold"
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-800" // Background circle
                />
                <motion.circle // Animated progress circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - calculateProgress() / 100)}
                  className={mode === "focus" ? "text-white" : "text-green-500"}
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - calculateProgress() / 100) }}
                  transition={{ duration: 0.5, ease: "linear" }} // Smooth transition for progress
                />
              </svg>
            </div>
            <div className="flex space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={toggleTimer}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label={isActive ? "Pause timer" : "Start timer"}
                >
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-400 flex justify-between">
          <div className="flex items-center">
            {mode === "focus" ? (
              <Play className="h-3 w-3 mr-1" /> // Could be a more "focus" related icon
            ) : (
              <Coffee className="h-3 w-3 mr-1" />
            )}
            <span>{mode === "focus" ? "Focus: 25 min" : "Break: 5 min"}</span>
          </div>
          <div>{isActive ? "Running" : "Paused"}</div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
