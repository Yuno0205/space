"use client";

import { PronunciationScore } from "@/components/english/speaking-practice";
import { useState, useEffect } from "react";

// Define the key for localStorage
const PRONUNCIATION_SCORES_KEY = "vocabulary-pronunciation-scores";

export function usePronunciationStore() {
  const [pronunciationScores, setPronunciationScores] = useState<PronunciationScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedScores = localStorage.getItem(PRONUNCIATION_SCORES_KEY);

        if (storedScores) {
          setPronunciationScores(JSON.parse(storedScores));
        }
      } catch (error) {
        console.error("Error loading pronunciation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(PRONUNCIATION_SCORES_KEY, JSON.stringify(pronunciationScores));
    }
  }, [pronunciationScores, isLoading]);

  // Add a new score
  const addScore = (score: PronunciationScore) => {
    setPronunciationScores((prev) => [...prev, score]);
  };

  return {
    pronunciationScores,
    addScore,
    isLoading,
  };
}
