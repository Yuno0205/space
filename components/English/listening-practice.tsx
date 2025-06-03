"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2, Undo2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Giả sử bạn đã cài đặt shadcn/ui và các component này
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ListeningExercise {
  id: number;
  relatedVocabulary?: string; // Từ vựng liên quan (nếu có)
  fullSentenceText: string; // Câu đầy đủ để phát và là đáp án
}

// Hàm giả lập cho Text-to-Speech (TTS)
// Trong thực tế, bạn sẽ sử dụng API SpeechSynthesis của trình duyệt hoặc một dịch vụ TTS bên thứ ba
const speak = (text: string, onEnd?: () => void): SpeechSynthesisUtterance | null => {
  console.log("TTS: Đang phát - ", text);
  if (typeof SpeechSynthesisUtterance !== "undefined" && typeof speechSynthesis !== "undefined") {
    // Hủy bỏ bất kỳ phát biểu nào đang diễn ra hoặc đang chờ
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Đặt ngôn ngữ cho TTS (ví dụ: tiếng Anh-Mỹ)
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis Error:", event);
      if (onEnd) onEnd(); // Cũng gọi onEnd nếu có lỗi để reset trạng thái
    };
    speechSynthesis.speak(utterance);
    return utterance;
  } else {
    console.warn("SpeechSynthesis API không được trình duyệt này hỗ trợ.");
    // Giả lập thời gian phát nếu không có API
    setTimeout(
      () => {
        if (onEnd) onEnd();
      },
      text.length * 50 + 500
    ); // Thời gian giả lập dựa trên độ dài văn bản
    return null;
  }
};

// Hàm xáo trộn mảng (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Hoán đổi phần tử
  }
  return newArray;
}

// Dữ liệu bài tập mẫu - bạn sẽ thay thế bằng dữ liệu từ Supabase
const initialExercises: ListeningExercise[] = [
  {
    id: 1,
    relatedVocabulary: "Diligent",
    fullSentenceText: "She is a very diligent student who always completes her homework on time.",
  },
  {
    id: 2,
    relatedVocabulary: "Efficient",
    fullSentenceText:
      "The new software significantly improved our workflow, making tasks much more efficient.",
  },
  {
    id: 3,
    relatedVocabulary: "Persuade",
    fullSentenceText:
      "He tried to persuade his colleagues to adopt the new strategy during the meeting.",
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

  const currentExercise = exercises[currentQuestionIndex];
  // Tiến độ dựa trên số câu đã qua (kể cả câu hiện tại)
  const progressPercentage = ((currentQuestionIndex + 1) / exercises.length) * 100;

  // Hàm chuẩn bị các phần của câu cho bài tập hiện tại
  const prepareExercise = useCallback((exercise: ListeningExercise | undefined) => {
    if (!exercise) return;

    // Tách câu thành các từ/cụm từ. Bạn có thể cần logic tách phức tạp hơn cho cụm từ.
    // Ở đây, chúng ta tách theo khoảng trắng và loại bỏ các phần tử rỗng.
    const parts = exercise.fullSentenceText.split(/\s+/).filter(Boolean);
    setAvailableParts(shuffleArray(parts));
    setSelectedParts([]);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setIsSpeaking(false);

    // Dừng bất kỳ âm thanh TTS nào đang phát trước khi chuẩn bị câu mới
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    setCurrentUtterance(null);
  }, []);

  // Chuẩn bị bài tập khi câu hỏi thay đổi
  useEffect(() => {
    prepareExercise(exercises[currentQuestionIndex]);
  }, [currentQuestionIndex, exercises, prepareExercise]);

  // Xử lý việc phát/dừng câu
  const handlePlaySentence = () => {
    if (!currentExercise) return;

    if (isSpeaking && currentUtterance) {
      // Nếu đang phát và có utterance -> Dừng
      speechSynthesis.pause();
      setIsSpeaking(false);
    } else if (!isSpeaking && currentUtterance && speechSynthesis.paused) {
      // Nếu đã dừng và có utterance -> Tiếp tục
      speechSynthesis.resume();
      setIsSpeaking(true);
    } else {
      // Nếu chưa phát hoặc utterance cũ đã kết thúc -> Phát mới
      setIsSpeaking(true);
      const utterance = speak(currentExercise.fullSentenceText, () => {
        setIsSpeaking(false); // Callback khi TTS kết thúc
      });
      setCurrentUtterance(utterance);
    }
  };

  // Xử lý việc phát lại câu từ đầu
  const handleReplaySentence = () => {
    if (!currentExercise) return;
    setIsSpeaking(true);
    const utterance = speak(currentExercise.fullSentenceText, () => {
      setIsSpeaking(false);
    });
    setCurrentUtterance(utterance);
  };

  // Xử lý việc chọn một phần từ/cụm từ
  const handleSelectPart = (part: string, index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedParts([...selectedParts, part]);
    setAvailableParts((prevParts) => prevParts.filter((_, i) => i !== index));
  };

  // Xử lý việc bỏ chọn một phần từ/cụm từ
  const handleDeselectPart = (part: string, index: number) => {
    if (isAnswerSubmitted) return;
    setAvailableParts(shuffleArray([...availableParts, part])); // Thêm lại và xáo trộn
    setSelectedParts((prevParts) => prevParts.filter((_, i) => i !== index));
  };

  // Xử lý việc nộp câu trả lời
  const submitAnswer = () => {
    if (isAnswerSubmitted || !currentExercise) return;
    const userAnswer = selectedParts.join(" ");
    // Chuẩn hóa câu trả lời và đáp án đúng để so sánh (loại bỏ khoảng trắng thừa, có thể cả viết hoa/thường)
    const correctAnswerNormalized = currentExercise.fullSentenceText.replace(/\s+/g, " ").trim();
    const userAnswerNormalized = userAnswer.replace(/\s+/g, " ").trim();

    const correct = userAnswerNormalized.toLowerCase() === correctAnswerNormalized.toLowerCase();
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // Chuyển sang câu hỏi tiếp theo hoặc hoàn thành
  const nextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      // useEffect sẽ tự động gọi prepareExercise
    } else {
      // Kết thúc bài luyện tập
      setShowFinalScore(true);
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel(); // Dừng TTS khi kết thúc
      }
    }
  };

  // Làm lại bài tập hiện tại
  const resetCurrentExercise = () => {
    prepareExercise(currentExercise);
  };

  // Làm lại toàn bộ bài luyện tập
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFinalScore(false);
    // prepareExercise sẽ được gọi bởi useEffect
  };

  if (showFinalScore) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hoàn Thành!</CardTitle>
              <CardDescription>Bạn đã hoàn thành bài luyện nghe.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                Điểm của bạn: {score} / {exercises.length}
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={restartQuiz}>
                <RotateCcw className="mr-2 h-4 w-4" /> Làm lại từ đầu
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!currentExercise) {
    return <div className="text-center p-10">Đang tải bài tập...</div>;
  }

  return (
    <div className="space-y-6 max-w-full mx-auto">
      <motion.div
        key={currentQuestionIndex} // Key giúp Framer Motion nhận biết component thay đổi để chạy animation
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl sm:text-2xl">
              <Volume2 className="mr-2 h-6 w-6 text-blue-500" />
              Bài Luyện Nghe: Sắp Xếp Câu
            </CardTitle>
            <CardDescription>
              Bài {currentQuestionIndex + 1}/{exercises.length}
              {currentExercise.relatedVocabulary
                ? ` - Liên quan đến từ: "${currentExercise.relatedVocabulary}"`
                : " - Nghe và sắp xếp lại câu."}
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
                  className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                  aria-label={isSpeaking ? "Tạm dừng" : "Phát câu"}
                >
                  {isSpeaking ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleReplaySentence}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow"
                  aria-label="Phát lại câu"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            {/* Khu vực người dùng xây dựng câu */}
            <div
              className="min-h-[70px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 items-center shadow-inner"
              aria-label="Câu bạn đã ghép"
            >
              {selectedParts.length === 0 && !isAnswerSubmitted && (
                <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center">
                  Nhấp vào các từ/cụm từ bên dưới để tạo thành câu bạn nghe được.
                </p>
              )}
              {selectedParts.map((part, index) => (
                <motion.div
                  key={`selected-${currentQuestionIndex}-${index}-${part}`}
                  layout // Cho phép animation mượt mà khi thêm/xóa
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.2 }}
                >
                  <Badge
                    variant={
                      isAnswerSubmitted && !isCorrect
                        ? "destructive"
                        : isAnswerSubmitted && isCorrect
                          ? "default"
                          : "secondary"
                    }
                    className={`cursor-pointer p-2 px-3 text-base shadow-sm ${
                      isAnswerSubmitted
                        ? "cursor-not-allowed"
                        : "hover:bg-red-500/80 hover:text-white dark:hover:bg-red-700"
                    } ${isAnswerSubmitted && isCorrect ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                    onClick={() => !isAnswerSubmitted && handleDeselectPart(part, index)}
                    title={!isAnswerSubmitted ? "Bỏ chọn từ này" : ""}
                  >
                    {part}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Ngân hàng từ/cụm từ có sẵn */}
            <div
              className="min-h-[70px] rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex flex-wrap gap-2 justify-center bg-white dark:bg-gray-900/70 items-center shadow"
              aria-label="Các từ/cụm từ có sẵn để chọn"
            >
              {availableParts.length === 0 && !isAnswerSubmitted && selectedParts.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn đã chọn hết các từ. Nhấn `&quot;`Kiểm tra`&quot;` hoặc sửa lại câu.
                </p>
              )}
              {availableParts.length === 0 && isAnswerSubmitted && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isCorrect
                    ? "Chính xác! Nhấn 'Câu tiếp theo'."
                    : "Hãy nhấn 'Câu tiếp theo' hoặc 'Làm lại'."}
                </p>
              )}
              {availableParts.map((part, index) => (
                <motion.div
                  key={`available-${currentQuestionIndex}-${index}-${part}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="p-2 px-3 text-base shadow-sm"
                    onClick={() => handleSelectPart(part, index)}
                    disabled={isAnswerSubmitted}
                  >
                    {part}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Phản hồi sau khi kiểm tra */}
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 p-3 rounded-md text-center font-medium flex items-center justify-center gap-2 shadow ${
                  isCorrect
                    ? "bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 border border-green-500"
                    : "bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300 border border-red-500"
                }`}
              >
                {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span className="text-sm sm:text-base">
                  {isCorrect
                    ? "Chính xác!"
                    : `Chưa đúng. Đáp án đúng là: "${currentExercise.fullSentenceText}"`}
                </span>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-6">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Điểm: <span className="font-bold">{score}</span>/{exercises.length}
            </div>
            <div className="flex space-x-2 order-1 sm:order-2">
              <Button
                onClick={resetCurrentExercise}
                variant="outline"
                title="Làm lại câu này"
                disabled={isAnswerSubmitted && isCorrect === true} // Không cho làm lại nếu đã đúng
                className="px-3 sm:px-4"
              >
                <Undo2 className="h-4 w-4 sm:mr-2" />{" "}
                <span className="hidden sm:inline">Làm lại</span>
              </Button>
              {isAnswerSubmitted ? (
                <Button
                  onClick={nextQuestion}
                  className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4"
                >
                  {currentQuestionIndex < exercises.length - 1 ? "Câu tiếp theo" : "Kết quả"}
                </Button>
              ) : (
                <Button
                  onClick={submitAnswer}
                  disabled={selectedParts.length === 0}
                  className="min-w-[110px] sm:min-w-[120px] px-3 sm:px-4"
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tiến độ của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3 rounded-full" />
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-right">
              {currentQuestionIndex + 1} / {exercises.length} câu
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
