"use client";
import React, { useState } from "react";

const exercises = [
  {
    id: 1,
    text: "ephemeral",
    phonetic: "/ɪˈfɛmərəl/",
    audioUrl: "/audio/ephemeral.mp3",
  },
  {
    id: 2,
    text: "abandon",
    phonetic: "/əˈbændən/",
    audioUrl: "/audio/abandon.mp3",
  },
  {
    id: 3,
    text: "knowledge",
    phonetic: "/ˈnɑlɪdʒ/",
    audioUrl: "/audio/knowledge.mp3",
  },
];

const SpeakingPage: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [, setScore] = useState(0);

  // const handleScoreChange = (newScore: number) => {
  //   setScore(newScore);
  // };

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
      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Luyện phát âm tiếng Anh</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Bài tập {currentExercise + 1}/{exercises.length}
            </h2>
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2">{exercises[currentExercise].text}</h3>
              <p className="text-gray-500">{exercises[currentExercise].phonetic}</p>
            </div>
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
        </div>
      </main>
    </div>
  );
};

export default SpeakingPage;
