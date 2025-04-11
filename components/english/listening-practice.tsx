"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function ListeningPractice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const listeningExercises = [
    {
      id: 1,
      title: "Business Meeting",
      audioUrl: "#", // Replace with actual audio URL
      question: "What is the main topic of the meeting?",
      options: [
        { id: "a", text: "Budget planning" },
        { id: "b", text: "Marketing strategy" },
        { id: "c", text: "Product development" },
        { id: "d", text: "Team restructuring" },
      ],
      correctAnswer: "b",
    },
    {
      id: 2,
      title: "Weather Forecast",
      audioUrl: "#", // Replace with actual audio URL
      question: "What will the weather be like tomorrow?",
      options: [
        { id: "a", text: "Sunny" },
        { id: "b", text: "Rainy" },
        { id: "c", text: "Cloudy with a chance of rain" },
        { id: "d", text: "Snowy" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      title: "Restaurant Conversation",
      audioUrl: "#", // Replace with actual audio URL
      question: "What does the customer order?",
      options: [
        { id: "a", text: "Steak and salad" },
        { id: "b", text: "Fish and chips" },
        { id: "c", text: "Pasta with seafood" },
        { id: "d", text: "Vegetarian pizza" },
      ],
      correctAnswer: "a",
    },
  ];

  const currentExercise = listeningExercises[currentQuestion];
  const progress = ((currentQuestion + 1) / listeningExercises.length) * 100;

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Here you would typically control the audio playback
  };

  const resetAudio = () => {
    setIsPlaying(false);
    // Here you would typically reset the audio to the beginning
  };

  const handleAnswerSelect = (value: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(value);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer && !isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      if (selectedAnswer === currentExercise.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < listeningExercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setIsPlaying(false);
    }
  };

  // const isCorrect = selectedAnswer === currentExercise.correctAnswer

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="mr-2 h-5 w-5" />
              {currentExercise.title}
            </CardTitle>
            <CardDescription>
              Bài {currentQuestion + 1}/{listeningExercises.length} - Nghe và trả lời câu hỏi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={togglePlayback}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={resetAudio}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentExercise.question}</h3>
              <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                {currentExercise.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-md border p-3 ${
                      isAnswerSubmitted
                        ? option.id === currentExercise.correctAnswer
                          ? "border-green-500 bg-green-500/10"
                          : selectedAnswer === option.id
                            ? "border-red-500 bg-red-500/10"
                            : "border-white/10"
                        : "border-white/10"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={isAnswerSubmitted}
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {option.text}
                    </Label>
                    {isAnswerSubmitted && option.id === currentExercise.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {isAnswerSubmitted &&
                      selectedAnswer === option.id &&
                      option.id !== currentExercise.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm">
              Điểm: {score}/{listeningExercises.length}
            </div>
            <div className="space-x-2">
              {!isAnswerSubmitted ? (
                <Button onClick={submitAnswer} disabled={!selectedAnswer}>
                  Kiểm tra
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {currentQuestion < listeningExercises.length - 1 ? "Câu tiếp theo" : "Hoàn thành"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tiến độ</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-400 mt-2">
              {currentQuestion + 1}/{listeningExercises.length} câu hỏi
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
