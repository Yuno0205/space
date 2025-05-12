"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Mic, RefreshCw, Save, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePronunciationStore } from "@/utils/Speech/pronunciation-store";

export type VocabularyCard = {
  id: number;
  word: string;
  phonetic?: string;
  audio_url?: string;
  word_type?: string;
  definition: string;
  translation?: string;
  example: string;
};

export type PronunciationScore = {
  id: string;
  wordId: number;
  word: string;
  score: number;
  transcript: string;
  date: string;
};

// Example data
const exampleCards: VocabularyCard[] = [
  {
    id: 1,
    word: "ephemeral",
    phonetic: "/ɪˈfɛm(ə)rəl/",
    audio_url: "https://example.com/audio/ephemeral.mp3",
    word_type: "adjective",
    definition: "Lasting for a very short time.",
    translation: "Ngắn ngủi, thoáng qua",
    example: "The ephemeral nature of fashion trends makes it hard to keep up.",
  },
  {
    id: 2,
    word: "abandon",
    phonetic: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    audio_url: "https://example.com/audio/serendipity.mp3",
    word_type: "noun",
    definition: "The occurrence and development of events by chance in a happy or beneficial way.",
    translation: "Tình cờ may mắn",
    example: "The discovery of penicillin was a serendipity.",
  },
  {
    id: 3,
    word: "ubiquitous",
    phonetic: "/juːˈbɪk.wɪ.təs/",
    audio_url: "https://example.com/audio/ubiquitous.mp3",
    word_type: "adjective",
    definition: "Present, appearing, or found everywhere.",
    translation: "Phổ biến, có mặt khắp nơi",
    example: "Mobile phones are now ubiquitous in modern society.",
  },
  {
    id: 4,
    word: "eloquent",
    phonetic: "/ˈɛləkwənt/",
    audio_url: "https://example.com/audio/eloquent.mp3",
    word_type: "adjective",
    definition: "Fluent or persuasive in speaking or writing.",
    translation: "Hùng biện, lưu loát",
    example: "She gave an eloquent speech that moved the audience.",
  },
  {
    id: 5,
    word: "resilience",
    phonetic: "/rɪˈzɪliəns/",
    audio_url: "https://example.com/audio/resilience.mp3",
    word_type: "noun",
    definition: "The capacity to recover quickly from difficulties; toughness.",
    translation: "Khả năng phục hồi, sức bền",
    example: "The resilience of the human spirit is remarkable.",
  },
];

interface SpeakingPracticeProps {
  cards?: VocabularyCard[];
}

export default function SpeakingPractice({ cards = exampleCards }: SpeakingPracticeProps) {
  const { addScore, pronunciationScores, isLoading } = usePronunciationStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [detailedScores, setDetailedScores] = useState<{
    accuracy: number;
    fluency: number;
    completeness: number;
  }>({ accuracy: 0, fluency: 0, completeness: 0 });
  const [showDefinition, setShowDefinition] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScoreHistory, setShowScoreHistory] = useState(false);

  const recognitionRef = useRef<any>(null);
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  const currentCard = cards[currentCardIndex] || {
    id: 0,
    word: "Không có từ nào",
    definition: "Không có từ nào trong danh sách này.",
    example: "",
  };

  // Get word history for current card
  const currentWordHistory = pronunciationScores
    .filter((item) => item.wordId === currentCard.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US"; // Set to English for vocabulary practice

        recognitionRef.current.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript.toLowerCase();
          const confidence = event.results[0][0].confidence;
          setTranscript(speechResult);

          // Compare with current word
          const currentWord = currentCard.word.toLowerCase();

          // Calculate various aspects of pronunciation
          const similarity = calculateSimilarity(speechResult, currentWord);
          const wordCompleteness = calculateCompleteness(speechResult, currentWord);

          // Calculate if pronunciation is correct based on similarity
          const isCorrect = similarity > 0.7;

          setFeedback(isCorrect ? "correct" : "incorrect");

          // Calculate detailed scores
          const accuracyScore = Math.round(similarity * 100);
          const fluencyScore = Math.round(confidence * 100);
          const completenessScore = Math.round(wordCompleteness * 100);

          // Calculate overall score (weighted average)
          const overallScore = Math.round(
            accuracyScore * 0.5 + fluencyScore * 0.3 + completenessScore * 0.2
          );

          setPronunciationScore(overallScore);
          setDetailedScores({
            accuracy: accuracyScore,
            fluency: fluencyScore,
            completeness: completenessScore,
          });
        };

        recognitionRef.current.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "no-speech") {
            setError("Không nghe thấy giọng nói. Vui lòng thử lại.");
          } else if (event.error === "audio-capture") {
            setError("Không tìm thấy microphone. Vui lòng kiểm tra thiết bị của bạn.");
          } else if (event.error === "not-allowed") {
            setError(
              "Trình duyệt không cho phép truy cập microphone. Vui lòng cấp quyền và thử lại."
            );
          } else {
            setError(`Lỗi: ${event.error}`);
          }
          setTimeout(() => setError(null), 3000);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setError(
          "Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome, Edge hoặc Safari."
        );
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentCard.id, currentCard.word]);

  const startListening = () => {
    setTranscript("");
    setFeedback("");
    setError(null);
    setShowScoreHistory(false);

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Speech recognition error:", err);
      setError("Có lỗi khi khởi động nhận dạng giọng nói. Vui lòng thử lại.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const playAudio = () => {
    if (currentCard.audio_url) {
      const audio = new Audio(currentCard.audio_url);
      audio.play();
    } else if ("speechSynthesis" in window) {
      // Use text-to-speech if no audio URL is available
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setTranscript("");
      setFeedback("");
      setShowDefinition(false);
      setShowScoreHistory(false);
    }
  };

  const resetCard = () => {
    setTranscript("");
    setFeedback("");
    setShowScoreHistory(false);
  };

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  const toggleScoreHistory = () => {
    setShowScoreHistory(!showScoreHistory);
  };

  const saveScore = () => {
    if (addScore && pronunciationScore > 0) {
      const newScore: PronunciationScore = {
        id: Date.now().toString(),
        wordId: currentCard.id,
        word: currentCard.word,
        score: pronunciationScore,
        transcript: transcript,
        date: new Date().toISOString(),
      };
      addScore(newScore);
    }
  };

  // Calculate similarity between two strings (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const distance = track[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength > 0 ? 1 - distance / maxLength : 1;
  };

  // Calculate completeness (how much of the target word was captured)
  const calculateCompleteness = (spoken: string, target: string): number => {
    const spokenWords = spoken.split(" ");

    // Check if the target word appears completely in any of the spoken words
    for (const word of spokenWords) {
      if (word === target) return 1.0;
    }

    // Check if target word is contained within the spoken text
    if (spoken.includes(target)) return 0.9;

    // Calculate what percentage of characters in the target word appear in the spoken text
    let matchedChars = 0;
    for (const char of target) {
      if (spoken.includes(char)) {
        matchedChars++;
      }
    }

    return matchedChars / target.length;
  };

  // Get feedback message based on score
  const getFeedbackMessage = (score: number): string => {
    if (score >= 90) return "Tuyệt vời! Phát âm của bạn rất chuẩn xác.";
    if (score >= 80) return "Rất tốt! Phát âm của bạn khá chính xác.";
    if (score >= 70) return "Tốt! Phát âm của bạn đúng phần lớn.";
    if (score >= 60) return "Khá tốt. Tiếp tục luyện tập nhé!";
    if (score >= 50) return "Cần cải thiện. Hãy nghe và thử lại.";
    return "Hãy nghe phát âm chuẩn và thử lại.";
  };

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  if (cards.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardTitle className="mb-4">Không có từ nào</CardTitle>
        <CardDescription>Không có từ nào trong danh sách.</CardDescription>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="text-center p-6">
        <CardTitle className="mb-4">Đang tải...</CardTitle>
        <CardDescription>Vui lòng đợi trong giây lát.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="mr-2 h-5 w-5" />
                Luyện nói
              </div>
              <div className="text-sm font-normal">
                {currentCardIndex + 1}/{cards.length}
              </div>
            </CardTitle>
            <CardDescription>Nhấn nút microphone và đọc từ vựng</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Word display */}
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">{currentCard.word}</h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-gray-400">{currentCard.phonetic}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={playAudio}
                  >
                    <Volume2 className="h-4 w-4" />
                    <span className="sr-only">Phát âm thanh</span>
                  </Button>
                </div>
                {currentCard.word_type && (
                  <Badge variant="outline" className="mt-2">
                    {currentCard.word_type}
                  </Badge>
                )}
              </div>

              {/* Microphone button */}
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isListening
                      ? {
                          scale: [1, 1.1, 1],
                          transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                        }
                      : {}
                  }
                >
                  <Button
                    size="lg"
                    className={cn(
                      "rounded-full h-16 w-16 flex items-center justify-center",
                      isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
                    )}
                    onClick={isListening ? stopListening : startListening}
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                </motion.div>
              </div>

              {/* Transcript and feedback */}
              {transcript && (
                <div className="w-full max-w-md">
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium">Bạn đã nói:</p>
                    <p
                      className={cn(
                        "text-xl",
                        feedback === "correct"
                          ? "text-green-500"
                          : feedback === "incorrect"
                            ? "text-red-500"
                            : ""
                      )}
                    >
                      {transcript}
                    </p>
                  </div>

                  {feedback && (
                    <div className="flex flex-col items-center space-y-4">
                      {/* Score display */}
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Điểm phát âm:</h4>
                          <span
                            className={cn("text-2xl font-bold", getScoreColor(pronunciationScore))}
                          >
                            {pronunciationScore}
                          </span>
                        </div>

                        <p className="text-center mb-4">{getFeedbackMessage(pronunciationScore)}</p>

                        {/* Detailed scores */}
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Độ chính xác:</span>
                              <span>{detailedScores.accuracy}%</span>
                            </div>
                            <Progress value={detailedScores.accuracy} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Độ trôi chảy:</span>
                              <span>{detailedScores.fluency}%</span>
                            </div>
                            <Progress value={detailedScores.fluency} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Độ đầy đủ:</span>
                              <span>{detailedScores.completeness}%</span>
                            </div>
                            <Progress value={detailedScores.completeness} className="h-2" />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button variant="outline" size="sm" onClick={resetCard}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Thử lại
                          </Button>
                          <Button variant="outline" size="sm" onClick={toggleDefinition}>
                            {showDefinition ? "Ẩn định nghĩa" : "Xem định nghĩa"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={saveScore}>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu điểm
                          </Button>
                          {currentWordHistory.length > 0 && (
                            <Button variant="outline" size="sm" onClick={toggleScoreHistory}>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              {showScoreHistory ? "Ẩn lịch sử" : "Xem lịch sử"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Score history */}
              {showScoreHistory && currentWordHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="w-full max-w-md border rounded-lg p-4 mt-2"
                >
                  <h4 className="font-medium mb-3">Lịch sử điểm của từ "{currentCard.word}"</h4>
                  <div className="space-y-2">
                    {currentWordHistory.slice(0, 5).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div>
                          <div className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}{" "}
                            {new Date(item.date).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-gray-400">"{item.transcript}"</div>
                        </div>
                        <div className={cn("font-bold", getScoreColor(item.score))}>
                          {item.score}
                        </div>
                      </div>
                    ))}
                    {currentWordHistory.length > 5 && (
                      <div className="text-center text-sm text-gray-500 mt-2">
                        + {currentWordHistory.length - 5} lần luyện tập khác
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Definition (conditionally shown) */}
              {showDefinition && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="w-full max-w-md border rounded-lg p-4 mt-2"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Định nghĩa:</h4>
                      <p className="text-gray-600">{currentCard.definition}</p>
                      {currentCard.translation && (
                        <p className="text-gray-400 italic mt-1">({currentCard.translation})</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Ví dụ:</h4>
                      <p className="text-gray-600 italic">&quot;{currentCard.example}&quot;</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <div className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={nextCard}
                disabled={currentCardIndex >= cards.length - 1}
              >
                Từ tiếp theo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <div>
                Từ hiện tại: {currentCardIndex + 1}/{cards.length}
              </div>
              <div>Hoàn thành: {Math.round(progress)}%</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
