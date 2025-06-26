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
  HelpCircle,
  Target,
  BookOpen,
} from "lucide-react"; // --- THAY ĐỔI: Bỏ ChevronDown, ChevronUp
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
  category?: string;
  example?: string;
  phonetic?: string;
}

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

// --- THAY ĐỔI: Thêm hàm tạo chữ cái mồi ---
const generateDecoyLetters = (count: number, existingLetters: string[]): string[] => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const decoys: string[] = [];
  const existingSet = new Set(existingLetters);

  while (decoys.length < count) {
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!existingSet.has(randomChar) && !decoys.includes(randomChar)) {
      decoys.push(randomChar);
    }
  }
  return decoys;
};

// Dữ liệu bài tập mẫu
const initialExercises: ListeningExercise[] = [
  {
    id: 1,
    relatedVocabulary: "Diligent",
    fullSentenceText: "diligent",
    definition: "Working hard and carefully",
    category: "Personality trait",
    example: "She is very _____ in her studies.",
    phonetic: "/ˈdɪlɪdʒənt/",
  },
  {
    id: 2,
    relatedVocabulary: "Efficient",
    fullSentenceText: "efficient",
    definition: "Working well without wasting time or energy",
    category: "Work quality",
    example: "The new system is more _____ than the old one.",
    phonetic: "/ɪˈfɪʃənt/",
  },
  {
    id: 3,
    relatedVocabulary: "Persuade",
    fullSentenceText: "persuade",
    definition: "To convince someone to do something",
    category: "Communication",
    example: "He tried to _____ her to join the team.",
    phonetic: "/pərˈsweɪd/",
  },
  // Thêm các bài tập khác nếu muốn
];

// --- THAY ĐỔI: Thêm interface cho gợi ý ---
interface Hint {
  title: string;
  content: string;
  icon: React.ElementType;
  color: string;
}

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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);

  // --- THAY ĐỔI: State cho hệ thống gợi ý mới ---
  const [activeHint, setActiveHint] = useState<Hint | null>(null);
  const [isHintUsed, setIsHintUsed] = useState(false);

  const currentExercise = exercises[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / exercises.length) * 100;

  // Hàm tạo gợi ý theo cấp độ (Giữ nguyên vì rất hữu ích)
  const getHintByLevel = (level: number, exercise: ListeningExercise): Hint | null => {
    const word = exercise.fullSentenceText;
    switch (level) {
      case 1:
        return {
          title: "Độ dài từ",
          content: `Từ này có ${word.length} chữ cái.`,
          icon: Target,
          color: "blue",
        };
      case 2:
        return {
          title: "Chữ cái đầu và cuối",
          content: `Bắt đầu bằng "${word[0].toUpperCase()}" và kết thúc bằng "${word[word.length - 1].toUpperCase()}"`,
          icon: HelpCircle,
          color: "green",
        };
      case 3:
        return {
          title: "Chủ đề",
          content: `Thuộc chủ đề: ${exercise.category}`,
          icon: BookOpen,
          color: "purple",
        };
      case 4:
        return {
          title: "Câu ví dụ",
          content: exercise.example || "Không có ví dụ",
          icon: Eye,
          color: "orange",
        };
      case 5:
        return {
          title: "Định nghĩa",
          content: exercise.definition || "Không có định nghĩa",
          icon: Lightbulb,
          color: "yellow",
        };
      case 6:
        return {
          title: "Phiên âm",
          content: exercise.phonetic || "Không có phiên âm",
          icon: Volume2,
          color: "pink",
        };
      default:
        return null; // Không trả về gợi ý cấp 7 (đáp án) một cách ngẫu nhiên
    }
  };

  // --- THAY ĐỔI: Hàm xử lý gợi ý mới ---
  const handleShowHint = () => {
    if (isHintUsed || isAnswerSubmitted) return;

    const randomLevel = Math.floor(Math.random() * 6) + 1;
    const hint = getHintByLevel(randomLevel, currentExercise);

    if (hint) {
      setActiveHint(hint);
      setIsHintUsed(true);
      setHintsUsed((prev) => prev + 1);
    }
  };

  // --- THAY ĐỔI: Cập nhật prepareExercise ---
  const prepareExercise = useCallback((exercise: ListeningExercise | undefined) => {
    if (!exercise) return;

    const correctLetters = exercise.fullSentenceText
      .toLowerCase()
      .split("")
      .filter((letter) => letter.trim() !== "");

    // Thêm 3 chữ cái mồi để tăng độ khó
    const decoyLetters = generateDecoyLetters(3, correctLetters);

    const allParts = [...correctLetters, ...decoyLetters];
    setAvailableParts(shuffleArray(allParts));

    setSelectedParts([]);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setIsSpeaking(false);

    // Reset lại state của gợi ý cho câu mới
    setActiveHint(null);
    setIsHintUsed(false);

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
    setIsSpeaking(true);
    const utterance = speak(currentExercise.fullSentenceText, () => {
      setIsSpeaking(false);
    });
    setCurrentUtterance(utterance);
  };

  const handleSelectPart = (part: string, index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedParts([...selectedParts, part]);
    setAvailableParts((prevParts) => prevParts.filter((_, i) => i !== index));
  };

  const handleDeselectPart = (part: string, index: number) => {
    if (isAnswerSubmitted) return;
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
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
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
    prepareExercise(currentExercise);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFinalScore(false);
    setHintsUsed(0);
    setStreak(0);
    // --- THAY ĐỔI: Reset state gợi ý khi chơi lại ---
    setActiveHint(null);
    setIsHintUsed(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300",
      green:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300",
      purple:
        "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300",
      orange:
        "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300",
      yellow:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300",
      pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300",
      red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
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
                    Bài {currentQuestionIndex + 1}/{exercises.length} - Nghe và ghép các chữ cái
                    thành từ hoàn chỉnh
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

              {/* --- THAY ĐỔI: KHU VỰC GỢI Ý MỚI --- */}
              <div className="flex flex-col items-center justify-center space-y-4 min-h-[100px]">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handleShowHint}
                    disabled={isHintUsed || isAnswerSubmitted}
                    variant="outline"
                    className="rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Lấy gợi ý"
                  >
                    <Lightbulb className="h-7 w-7 text-yellow-500" />
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {activeHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className={`w-full border rounded-lg p-3 text-center ${getColorClasses(activeHint.color)}`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <activeHint.icon className="h-4 w-4" />
                        <span className="font-medium">{activeHint.title}</span>
                      </div>
                      <p>{activeHint.content}</p>
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
                  className={`mt-4 p-4 rounded-xl text-center font-medium shadow-lg ${
                    isCorrect
                      ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 text-green-700 dark:text-green-300 border-2 border-green-500"
                      : "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800/40 dark:to-red-700/40 text-red-700 dark:text-red-300 border-2 border-red-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <XCircle className="h-6 w-6" />
                    )}
                    <span className="text-sm sm:text-base">
                      {isCorrect ? "🎉 Chính xác!" : "❌ Chưa đúng"}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      <p>
                        Đáp án đúng là:{" "}
                        <span className="font-bold">{currentExercise.fullSentenceText}</span>
                      </p>
                      <p className="mt-1">
                        Từ vựng:{" "}
                        <span className="font-bold">{currentExercise.relatedVocabulary}</span>
                      </p>
                    </div>
                  )}
                  {isCorrect && (
                    <div className="text-sm">
                      <p>
                        Từ vựng:{" "}
                        <span className="font-bold">{currentExercise.relatedVocabulary}</span>
                      </p>
                      <p>Nghĩa: {currentExercise.definition}</p>
                    </div>
                  )}
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
