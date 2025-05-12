"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VocabularyCard } from "@/types/vocabulary";
import { ArrowRight, Check, Mic, Volume2, X } from "lucide-react";
import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import stringSimilarity from "string-similarity";

// Dữ liệu mẫu từ vựng
export const exampleCards = [
  {
    id: "1",
    word: "ephemeral",
    phonetic: "/ɪˈfɛm(ə)rəl/",
    audio_url: "https://example.com/audio/ephemeral.mp3",
    word_type: "adjective",
    definition: "Lasting for a very short time.",
    translation: "Ngắn ngủi, thoáng qua",
    example: "The ephemeral nature of fashion trends makes it hard to keep up.",
  },
  {
    id: "2",
    word: "serendipity",
    phonetic: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    audio_url: "https://example.com/audio/serendipity.mp3",
    word_type: "noun",
    definition: "The occurrence and development of events by chance in a happy or beneficial way.",
    translation: "Tình cờ may mắn",
    example: "The discovery of penicillin was a serendipity.",
  },
  {
    id: "3",
    word: "ubiquitous",
    phonetic: "/juːˈbɪk.wɪ.təs/",
    audio_url: "https://example.com/audio/ubiquitous.mp3",
    word_type: "adjective",
    definition: "Present, appearing, or found everywhere.",
    translation: "Phổ biến, có mặt khắp nơi",
    example: "Mobile phones are now ubiquitous in modern society.",
  },
];

export default function SpeakingPractice() {
  const [cards] = useState<VocabularyCard[]>(exampleCards);
  const [index, setIndex] = useState<number>(0);
  const currentCard = cards[index];

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");
  const [score, setScore] = useState(0);
  const [wordAnalysis, setWordAnalysis] = useState<{ word: string; correct: boolean }[]>([]);
  const [autoStopTimer, setAutoStopTimer] = useState<NodeJS.Timeout | null>(null);
  const [showHint, setShowHint] = useState(false);

  console.log(score);

  // Kiểm tra hỗ trợ trình duyệt khi component mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Trình duyệt không hỗ trợ SpeechRecognition");
    }
  }, [browserSupportsSpeechRecognition]);

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => {
      if (autoStopTimer) {
        clearTimeout(autoStopTimer);
      }
    };
  }, [autoStopTimer]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Không được hỗ trợ</CardTitle>
          <CardDescription>
            Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome, Edge hoặc
            Safari mới nhất.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Chuẩn hóa chuỗi để so sánh
  const normalizeString = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:'"()]/g, "");

  // Phân tích phát âm từng âm tiết và phát hiện phát âm sai
  const analyzeWords = (spoken: string, target: string) => {
    const spokenNorm = normalizeString(spoken);
    const targetNorm = normalizeString(target);

    // Tính toán độ tương đồng tổng thể
    const overallSimilarity = stringSimilarity.compareTwoStrings(spokenNorm, targetNorm);

    // Tách từ thành các âm tiết để phân tích chi tiết
    // Ví dụ: "beautiful" -> ["beau", "ti", "ful"]
    // Đây là thuật toán đơn giản, trong thực tế có thể cần API phonetic chuyên nghiệp
    const syllables = target.match(
      /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi
    ) || [target];

    // Phân tích từng âm tiết
    const syllableAnalysis = syllables.map((syllable) => {
      // Tính toán một cách đơn giản xem âm tiết này có xuất hiện trong phát âm không
      const syllableNorm = normalizeString(syllable);
      const isInSpoken = spokenNorm.includes(syllableNorm);

      // Tính độ tương đồng của âm tiết này
      let syllableSimilarity = 0;
      if (isInSpoken) {
        syllableSimilarity = stringSimilarity.compareTwoStrings(
          syllableNorm,
          spokenNorm.substr(spokenNorm.indexOf(syllableNorm), syllableNorm.length)
        );
      }

      // Một số trường hợp đặc biệt
      let status: "correct" | "partial" | "incorrect" = "incorrect";
      if (syllableSimilarity > 0.8) {
        status = "correct";
      } else if (syllableSimilarity > 0.5) {
        status = "partial";
      }

      // Xác định loại lỗi phát âm (đơn giản)
      let errorType = null;
      if (status !== "correct") {
        // Nếu âm tiết không xuất hiện trong phát âm
        if (!isInSpoken) {
          errorType = "missingSound";
        }
        // Nếu phát âm có chứa âm tiết nhưng không chính xác
        else if (syllableSimilarity < 0.8) {
          errorType = "wrongSound";
        }
      }

      return {
        syllable,
        status,
        similarity: syllableSimilarity,
        errorType,
      };
    });

    // Đếm các âm tiết đúng để tính điểm
    const correctSyllables = syllableAnalysis.filter((s) => s.status === "correct").length;
    const partialSyllables = syllableAnalysis.filter((s) => s.status === "partial").length;
    const totalSyllables = syllableAnalysis.length;

    // Tính điểm dựa trên tỉ lệ âm tiết đúng
    const score = Math.round(
      (correctSyllables / totalSyllables) * 100 * 0.8 +
        (partialSyllables / totalSyllables) * 100 * 0.2
    );

    return {
      word: target,
      overall: {
        similarity: overallSimilarity,
        score: score,
      },
      syllableAnalysis: syllableAnalysis,
    };
  };

  const onToggleListen = () => {
    if (listening) {
      processSpeech();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    resetTranscript();
    setFeedback("");
    setScore(0);
    setWordAnalysis([]);
    setShowHint(false);

    SpeechRecognition.startListening({
      language: "en-US",
      continuous: false,
    });

    // Auto-stop sau 5 giây nếu người dùng không dừng
    const timer = setTimeout(() => {
      if (listening) {
        processSpeech();
      }
    }, 5000);

    setAutoStopTimer(timer);
  };

  const processSpeech = () => {
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      setAutoStopTimer(null);
    }

    SpeechRecognition.stopListening();

    const spoken = normalizeString(transcript);
    const target = normalizeString(currentCard.word);

    if (!spoken) {
      setFeedback("incorrect");
      setScore(0);
      setWordAnalysis([]);
      return;
    }

    // Sử dụng hàm phân tích phát âm cải tiến
    const analysis = analyzeWords(spoken, currentCard.word);

    // Cập nhật state với kết quả phân tích
    setWordAnalysis([analysis]); // Wrap trong array để tương thích với code hiện tại
    setScore(analysis.overall.score);
    setFeedback(analysis.overall.score > 70 ? "correct" : "incorrect");
  };

  const nextCard = () => {
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      setAutoStopTimer(null);
    }

    SpeechRecognition.stopListening();

    if (index < cards.length - 1) {
      setIndex(index + 1);
      resetTranscript();
      setFeedback("");
      setScore(0);
      setWordAnalysis([]);
      setShowHint(false);
    }
  };

  const playAudio = () => {
    if (currentCard.audio_url) {
      const audio = new Audio(currentCard.audio_url);
      audio.play().catch((err) => {
        console.error("Audio playback error:", err);
        useTTS();
      });
    } else {
      useTTS();
    }
  };

  const useTTS = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>#{index + 1} Luyện nói</CardTitle>
          <CardDescription>Nhấn 🎤 và đọc từ vựng</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-3xl font-bold">{currentCard.word}</h2>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-gray-500">{currentCard.phonetic}</p>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={playAudio}
                title="Nghe phát âm"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="py-2">
            <Button
              size="lg"
              className={cn(
                "rounded-full h-16 w-16",
                listening ? "bg-red-500 hover:bg-red-600" : "bg-primary"
              )}
              onClick={onToggleListen}
            >
              <Mic className="h-6 w-6" />
            </Button>
            {listening && <p className="text-sm mt-2 text-red-500">Đang nghe...</p>}
          </div>

          {transcript && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Bạn nói:</p>
                <p className="text-lg italic">{transcript}</p>
              </div>

              {feedback && (
                <div className="space-y-2">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {feedback === "correct" ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : (
                        <X className="h-6 w-6 text-red-500" />
                      )}
                      <span
                        className={cn(
                          "font-bold text-xl",
                          feedback === "correct" ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {score}%
                      </span>
                    </div>

                    {/* Hiển thị điểm chi tiết */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500">Phát âm</p>
                        <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              score > 80
                                ? "bg-green-500"
                                : score > 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            )}
                            style={{
                              width: `${Math.min(100, score + (feedback === "correct" ? 10 : -10))}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500">Thông thạo</p>
                        <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              score > 80
                                ? "bg-green-500"
                                : score > 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            )}
                            style={{
                              width: `${Math.min(100, score + (feedback === "correct" ? 5 : -15))}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500">Chính xác</p>
                        <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              score > 80
                                ? "bg-green-500"
                                : score > 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            )}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {wordAnalysis.length > 0 && wordAnalysis[0]?.syllableAnalysis && (
                    <div className="mt-4">
                      <p className="font-medium text-gray-700 mb-2">Phân tích phát âm:</p>

                      {/* Hiển thị từng âm tiết và trạng thái */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap justify-center gap-1 text-xl mb-3">
                          {wordAnalysis[0].syllableAnalysis.map((item, i) => (
                            <span
                              key={i}
                              className={cn(
                                "px-2 py-1 rounded font-medium transition-all",
                                item.status === "correct"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "partial"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              )}
                              title={
                                item.status === "correct"
                                  ? "Phát âm đúng"
                                  : item.status === "partial"
                                    ? "Phát âm gần đúng"
                                    : "Phát âm sai"
                              }
                            >
                              {item.syllable}
                            </span>
                          ))}
                        </div>

                        {/* Hiển thị điểm số */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Điểm phát âm:</span>
                            <span
                              className={cn(
                                "font-bold",
                                score > 80
                                  ? "text-green-600"
                                  : score > 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              )}
                            >
                              {score}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all",
                                score > 80
                                  ? "bg-green-500"
                                  : score > 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              )}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Hiển thị gợi ý cải thiện */}
                      {feedback === "incorrect" && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                          <p className="font-medium text-blue-800 mb-1">Gợi ý cải thiện:</p>
                          <ul className="text-blue-700 list-disc pl-5 space-y-1">
                            {wordAnalysis[0].syllableAnalysis.some(
                              (s) => s.status !== "correct"
                            ) && <li>Tập trung vào các âm tiết được highlight màu đỏ và vàng</li>}
                            {wordAnalysis[0].syllableAnalysis.some(
                              (s) => s.errorType === "missingSound"
                            ) && <li>Bạn bỏ qua một số âm khi phát âm, hãy phát âm đầy đủ</li>}
                            {wordAnalysis[0].syllableAnalysis.some(
                              (s) => s.errorType === "wrongSound"
                            ) && <li>Bạn phát âm sai một số âm, hãy nghe lại và thử lại</li>}
                            <li>Nghe mẫu và tập lại từng âm tiết một</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {feedback === "incorrect" && !showHint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(true)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Hiển thị gợi ý
                    </Button>
                  )}

                  {showHint && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Phát âm: {currentCard.phonetic}
                        <br />
                        Ví dụ: {currentCard.example}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button variant="outline" onClick={playAudio} className="flex-1">
            <Volume2 className="mr-2 h-4 w-4" /> Nghe lại
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={nextCard}
            disabled={index >= cards.length - 1}
          >
            Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
