"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Course } from "@/types/course";
import { LetterCard } from "./letter-card";

export const demoAlphabetCourses: Course[] = [
  {
    name: "Alpha",
    letter: "a",
    phonetic: "æ",
    audio_url: "/audio/a.mp3",
    total_words: 50,
    completed_words: 35,
  },
  {
    name: "Bravo",
    letter: "b",
    phonetic: "bi:",
    audio_url: "/audio/b.mp3",
    total_words: 45,
    completed_words: 20,
  },
  {
    name: "Charlie",
    letter: "c",
    phonetic: "si:",
    audio_url: "/audio/c.mp3",
    total_words: 40,
    completed_words: 40,
  },
  {
    name: "Delta",
    letter: "d",
    phonetic: "di:",
    audio_url: "/audio/d.mp3",
    total_words: 35,
    completed_words: 15,
  },
  {
    name: "Echo",
    letter: "e",
    phonetic: "i:",
    audio_url: "/audio/e.mp3",
    total_words: 30,
    completed_words: 25,
  },
  {
    name: "Foxtrot",
    letter: "f",
    phonetic: "ɛf",
    audio_url: "/audio/f.mp3",
    total_words: 48,
    completed_words: 12,
  },
];

export function AlphabetCourses() {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {demoAlphabetCourses.map((course, index) => (
        <motion.div
          key={course.letter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <LetterCard
            course={course}
            isHovered={hoveredLetter === course.letter}
            onHover={() => setHoveredLetter(course.letter)}
            onLeave={() => setHoveredLetter(null)}
          />
        </motion.div>
      ))}
    </div>
  );
}
