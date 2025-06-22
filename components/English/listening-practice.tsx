"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Volume2,
  Undo2,
  Lightbulb,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ListeningExercise {
  id: number;
  relatedVocabulary?: string;
  fullSentenceText: string;
  definition?: string;
  hint?: string;
}

// Hàm tạo âm thanh
const playSound = (
  frequency: number,
  duration: number,
  type: "sine" | "square" | "triangle" = "sine"
) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.log("Audio not supported");
  }
};

// Các âm thanh khác nhau
const sounds = {
  click: () => playSound(800, 0.1, "sine"),
  success: () => {
    playSound(523, 0.2, "sine"); // C5
    setTimeout(() => playSound(659, 0.2, "sine"), 100); // E5
    setTimeout(() => playSound(784, 0.3, "sine"), 200); // G5
  },
  error: () => {
    playSound(300, 0.3, "square");
    setTimeout(() => playSound(250, 0.3, "square"), 150);
  },
  select: () => playSound(600, 0.1, "triangle"),
  deselect: () => playSound(400, 0.1, "triangle"),
};

// Hàm giả lập cho Text-to-Speech (TTS)
const speak = (text: string, onEnd?: () => void): SpeechSynthesisUtterance | null => {
  console.log("TTS: Đang phát - ", text);
  if (typeof SpeechSynthesisUtterance !== "undefined" && typeof speechSynthesis !== "undefined") {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis Error:", event);
      if (onEnd) onEnd();
    };
    speechSynthesis.speak(utterance);
    return utterance;
  } else {
    console.warn("SpeechSynthesis API không được trình duyệt này hỗ trợ.");
    setTimeout(
      () => {
        if (onEnd) onEnd();
      },
      text.length * 50 + 500
    );
    return null;
  }
};

// Hàm xáo trộn mảng (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Dữ liệu bài tập mẫu với định nghĩa và gợi ý
const initialExercises: ListeningExercise[] = [
  {
    id: 1,
    relatedVocabulary: "Diligent",
    fullSentenceText: "diligent",
    definition: "Working hard and carefully",
    hint: "Starts with 'd' and means hardworking",
  },
  {
    id: 2,
    relatedVocabulary: "Efficient",
    fullSentenceText: "efficient",
    definition: "Working well without wasting time or energy",
    hint: "Starts with 'e' and relates to productivity",
  },
  {
    id: 3,
    relatedVocabulary: "Persuade",
    fullSentenceText: "persuade",
    definition: "To convince someone to do something",
    hint: "Starts with 'p' and means to convince",
  },
  {
    id: 4,
    relatedVocabulary: "Beautiful",
    fullSentenceText: "beautiful",
    definition: "Very attractive or pleasing to look at",
    hint: "Starts with 'b' and describes something pretty",
  },
  {
    id: 5,
    relatedVocabulary: "Important",
    fullSentenceText: "important",
    definition: "Having great significance or value",
    hint: "Starts with 'i' and means significant",
  },
  {
    id: 6,
    relatedVocabulary: "Knowledge",
    fullSentenceText: "knowledge",
    definition: "Information and understanding gained through experience",
    hint: "Starts with 'k' and relates to learning",
  },
];

export function ListeningPractice() {
  const [exercises] = useState<ListeningExercise[]>(initialExercises);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [availableParts, setAvailableParts] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHelpSection, setShowHelpSection] = useState(false);

  const currentExercise = exercises[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / exercises.length) * 100;

  // Hàm chuẩn bị các phần của từ cho bài tập hiện tại (tách thành từng chữ cái)
  const prepareExercise = useCallback((exercise: ListeningExercise | undefined) => {
    if (!exercise) return;

    // Tách từ thành các chữ cái
    const letters = exercise.fullSentenceText
      .toLowerCase()
      .split("")
      .filter((letter) => letter.trim() !== "");
    setAvailableParts(shuffleArray(letters));
    setSelectedParts([]);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setIsSpeaking(false);
    setShowHint(false);
    setShowDefinition(false);
    setShowHelpSection(false);

    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    setCurrentUtterance(null);
  }, []);

  useEffect(() => {
    prepareExercise(exercises[currentQuestionIndex]);
  }, [currentQuestionIndex, exercises, prepareExercise]);

  const handlePlaySentence = () => {
    if (!currentExercise) return;
    sounds.click();

    if (isSpeaking && currentUtterance) {
      speechSynthesis.pause();
      setIsSpeaking(false);
    } else if (!isSpeaking && currentUtterance && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsSpeaking(true);
    } else {
      setIsSpeaking(true);
      const utterance = speak(currentExercise.fullSentenceText, () => {
        setIsSpeaking(false);
      });
      setCurrentUtterance(utterance);
    }
  };

  const handleReplaySentence = () => {
    if (!currentExercise) return;
    sounds.click();
    setIsSpeaking(true);
    const utterance = speak(currentExercise.fullSentenceText, () => {
      setIsSpeaking(false);
    });
    setCurrentUtterance(utterance);
  };

  const handleSelectPart = (part: string, index: number) => {
    if (isAnswerSubmitted) return;
    sounds.select();
    setSelectedParts([...selectedParts, part]);
    setAvailableParts((prevParts) => prevParts.filter((_, i) => i !== index));
  };

  const handleDeselectPart = (part: string, index: number) => {
    if (isAnswerSubmitted) return;
    sounds.deselect();
    setAvailableParts(shuffleArray([...availableParts, part]));
    setSelectedParts((prevParts) => prevParts.filter((_, i) => i !== index));
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted || !currentExercise) return;
    const userAnswer = selectedParts.join("");
    const correctAnswerNormalized = currentExercise.fullSentenceText.toLowerCase().trim();
    const userAnswerNormalized = userAnswer.toLowerCase().trim();

    const correct = userAnswerNormalized === correctAnswerNormalized;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      sounds.success();
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
    } else {
      sounds.error();
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    sounds.click();
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowFinalScore(true);
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }
    }
  };

  const resetCurrentExercise = () => {
    sounds.click();
    prepareExercise(currentExercise);
  };

  const restartQuiz = () => {
    sounds.click();
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFinalScore(false);
    setHintsUsed(0);
    setStreak(0);
  };

  const handleShowHint = () => {
    sounds.click();
    setShowHint(true);
    setHintsUsed((prev) => prev + 1);
    if (!showHelpSection) setShowHelpSection(true);
  };

  const handleShowDefinition = () => {
    sounds.click();
    setShowDefinition(true);
    if (!showHelpSection) setShowHelpSection(true);
  };

  const toggleHelpSection = () => {
    sounds.click();
    setShowHelpSection(!showHelpSection);
  };

  if (showFinalScore) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <div className="space-y-6 max-w-2xl mx-auto text-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">🎉 Hoàn Thành!</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Bạn đã hoàn thành bài luyện nghe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-black dark:text-white">
                  {score} / {exercises.length}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="font-semibold text-gray-600 dark:text-gray-400">
                      Gợi ý đã dùng
                    </div>
                    <div className="text-lg font-bold text-black dark:text-white">{hintsUsed}</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="font-semibold text-gray-600 dark:text-gray-400">
                      Tỷ lệ chính xác
                    </div>
                    <div className="text-lg font-bold text-black dark:text-white">
                      {Math.round((score / exercises.length) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={restartQuiz}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Làm lại từ đầu
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="text-center p-10">Đang tải bài tập...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="space-y-6 max-w-full mx-auto p-4">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl sm:text-2xl text-black dark:text-white">
                <div className="flex items-center">
                  <Volume2 className="mr-2 h-6 w-6 text-gray-600 dark:text-gray-400" />
                  Bài Luyện Nghe: Ghép Chữ Thành Từ
                </div>
                {streak > 0 && (
                  <Badge className="bg-orange-500 text-white">🔥 {streak} streak</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    Bài {currentQuestionIndex + 1}/{exercises.length}
                    {currentExercise.relatedVocabulary && (
                      <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                        Từ vựng: "{currentExercise.relatedVocabulary}"
                      </span>
                    )}
                  </div>
                  <div className="text-sm">Gợi ý đã dùng: {hintsUsed}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Khu vực điều khiển âm thanh */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handlePlaySentence}
                    variant={isSpeaking ? "secondary" : "default"}
                    size="icon"
                    className={`h-16 w-16 rounded-full shadow-lg ${
                      isSpeaking
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    }`}
                    aria-label={isSpeaking ? "Tạm dừng" : "Phát từ"}
                  >
                    {isSpeaking ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handleReplaySentence}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full shadow border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Phát lại từ"
                  >
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                </motion.div>
              </div>

              {/* Khu vực gợi ý và trợ giúp - Collapsible */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Button
                  onClick={toggleHelpSection}
                  variant="ghost"
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Trợ giúp & Gợi ý</span>
                    {(showHint || showDefinition) && (
                      <Badge variant="secondary" className="text-xs">
                        {[showHint && "Gợi ý", showDefinition && "Định nghĩa"]
                          .filter(Boolean)
                          .join(", ")}
                      </Badge>
                    )}
                  </div>
                  {showHelpSection ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                <AnimatePresence>
                  {showHelpSection && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4 space-y-4">
                        {/* Buttons */}
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button
                            onClick={handleShowHint}
                            variant="outline"
                            size="sm"
                            disabled={showHint || isAnswerSubmitted}
                            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                          >
                            <Lightbulb className="mr-2 h-4 w-4" />
                            {showHint ? "Đã hiện gợi ý" : "Gợi ý"}
                          </Button>
                          <Button
                            onClick={handleShowDefinition}
                            variant="outline"
                            size="sm"
                            disabled={showDefinition}
                            className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {showDefinition ? "Đã hiện định nghĩa" : "Định nghĩa"}
                          </Button>
                        </div>

                        {/* Hiển thị gợi ý */}
                        {showHint && currentExercise.hint && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 mb-1">
                              <Lightbulb className="h-4 w-4" />
                              <span className="font-medium">Gợi ý:</span>
                            </div>
                            <p className="text-yellow-800 dark:text-yellow-200">
                              {currentExercise.hint}
                            </p>
                          </motion.div>
                        )}

                        {/* Hiển thị định nghĩa */}
                        {showDefinition && currentExercise.definition && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1">
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">Định nghĩa:</span>
                            </div>
                            <p className="text-blue-800 dark:text-blue-200">
                              {currentExercise.definition}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Khu vực người dùng xây dựng từ */}
              <div
                className="min-h-[80px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 flex flex-wrap gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 items-center justify-center shadow-inner"
                aria-label="Từ bạn đã ghép"
              >
                {selectedParts.length === 0 && !isAnswerSubmitted && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center">
                    Nhấp vào các chữ cái bên dưới để tạo thành từ bạn nghe được.
                  </p>
                )}
                {selectedParts.map((part, index) => (
                  <motion.div
                    key={`selected-${currentQuestionIndex}-${index}-${part}`}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.2 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`cursor-pointer p-3 px-4 text-2xl font-bold shadow-lg min-w-[60px] h-[60px] flex items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        isAnswerSubmitted
                          ? "cursor-not-allowed"
                          : "hover:shadow-xl hover:-translate-y-1"
                      } ${
                        isAnswerSubmitted && isCorrect
                          ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-green-500 shadow-green-200"
                          : isAnswerSubmitted && !isCorrect
                            ? "bg-gradient-to-br from-red-400 to-red-600 text-white border-red-500 shadow-red-200"
                            : "bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-500 shadow-blue-200 hover:from-blue-500 hover:to-blue-700"
                      }`}
                      onClick={() => !isAnswerSubmitted && handleDeselectPart(part, index)}
                      title={!isAnswerSubmitted ? "Bỏ chọn chữ này" : ""}
                    >
                      {part.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Ngân hàng chữ cái có sẵn */}
              <div
                className="min-h-[80px] rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-3 justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 items-center shadow-lg"
                aria-label="Các chữ cái có sẵn để chọn"
              >
                {availableParts.length === 0 && !isAnswerSubmitted && selectedParts.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bạn đã chọn hết các chữ. Nhấn "Kiểm tra" hoặc sửa lại từ.
                  </p>
                )}
                {availableParts.length === 0 && isAnswerSubmitted && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isCorrect
                      ? "Chính xác! Nhấn 'Từ tiếp theo'."
                      : "Hãy nhấn 'Từ tiếp theo' hoặc 'Làm lại'."}
                  </p>
                )}
                {availableParts.map((part, index) => (
                  <motion.div
                    key={`available-${currentQuestionIndex}-${index}-${part}`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`cursor-pointer p-3 px-4 text-2xl font-bold shadow-lg min-w-[60px] h-[60px] flex items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        isAnswerSubmitted
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-black dark:text-white border-gray-400 dark:border-gray-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 hover:shadow-xl hover:-translate-y-1"
                      }`}
                      onClick={() => handleSelectPart(part, index)}
                      title={!isAnswerSubmitted ? "Chọn chữ này" : ""}
                    >
                      {part.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Phản hồi sau khi kiểm tra */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mt-4 p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2 shadow-lg ${
                    isCorrect
                      ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 text-green-700 dark:text-green-300 border-2 border-green-500"
                      : "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800/40 dark:to-red-700/40 text-red-700 dark:text-red-300 border-2 border-red-500"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                  <span className="text-sm sm:text-base">
                    {isCorrect
                      ? "🎉 Chính xác!"
                      : `❌ Chưa đúng. Đáp án đúng là: "${currentExercise.fullSentenceText}"`}
                  </span>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                Điểm: <span className="font-bold">{score}</span>/{exercises.length}
              </div>
              <div className="flex space-x-2 order-1 sm:order-2">
                <Button
                  onClick={resetCurrentExercise}
                  variant="outline"
                  title="Làm lại từ này"
                  disabled={isAnswerSubmitted && isCorrect === true}
                  className="px-3 sm:px-4 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Undo2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Làm lại</span>
                </Button>
                {isAnswerSubmitted ? (
                  <Button
                    onClick={nextQuestion}
                    className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    {currentQuestionIndex < exercises.length - 1 ? "Từ tiếp theo" : "Kết quả"}
                  </Button>
                ) : (
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedParts.length === 0}
                    className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:text-gray-600"
                  >
                    Kiểm tra
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Thẻ Tiến độ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-black dark:text-white">Tiến độ của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={progressPercentage}
                className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-black dark:[&>div]:bg-white"
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
                {currentQuestionIndex + 1} / {exercises.length} từ
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
