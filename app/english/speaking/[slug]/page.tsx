"use client";
import React, { useState } from "react";
import Head from "next/head";
import PronunciationChecker from "@/components/PronunciationChecker";

const exercises = [
  {
    id: 1,
    text: "ephemeral",
  },
  {
    id: 2,
    text: "abandon",
  },
  {
    id: 3,
    text: "knowledge",
  },
];

const SpeakingPage: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const goToNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setScore(0);
    }
  };

  const goToPrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <Head>
        <title>Luyện phát âm tiếng Anh</title>
        <meta name="description" content="Ứng dụng luyện phát âm tiếng Anh" />
      </Head>

      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Luyện phát âm tiếng Anh</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Bài tập {currentExercise + 1}/{exercises.length}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevExercise}
                disabled={currentExercise === 0}
                className={`px-4 py-2 rounded ${
                  currentExercise === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                }`}
              >
                Trước
              </button>
              <button
                onClick={goToNextExercise}
                disabled={currentExercise === exercises.length - 1}
                className={`px-4 py-2 rounded ${
                  currentExercise === exercises.length - 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Tiếp theo
              </button>
            </div>
          </div>

          <PronunciationChecker
            targetText={exercises[currentExercise].text}
            onScoreChange={handleScoreChange}
          />
        </div>
      </main>
    </div>
  );
};

export default SpeakingPage;
