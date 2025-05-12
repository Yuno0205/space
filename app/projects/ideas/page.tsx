"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, MicOff, AlertTriangle } from "lucide-react";

// Các thư viện và API có thể sử dụng
// 1. Web Speech API (có sẵn trong trình duyệt)
// 2. Các thư viện ngữ âm học JavaScript (ví dụ: phoneme-js - để chuyển đổi văn bản thành âm vị)
// 3. Các dịch vụ Speech-to-Text miễn phí/hạn chế (ví dụ: Google Cloud Speech-to-Text)
// 4. Các mô hình AI/Machine Learning (cần kiến thức chuyên sâu)

const SpeakingTest = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null); // Thêm state để lưu điểm

  const targetText = "Abandon"; // Câu mẫu
  const [words, setWords] = useState<{ text: string; color: string }[]>(
    targetText.split(" ").map((word) => ({ text: word, color: "text-gray-300" }))
  );

  useEffect(() => {
    // Kiểm tra tính tương thích của trình duyệt với Web Speech API
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = true;
      newRecognition.lang = "en-US";

      newRecognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript("");
        setWords(targetText.split(" ").map((word) => ({ text: word, color: "text-gray-300" })));
        setScore(null); // Reset điểm khi bắt đầu
      };

      newRecognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + " ";
          } else {
            currentTranscript += event.results[i][0].transcript + " ";
          }
        }
        setTranscript(currentTranscript);
        // Gọi hàm phân tích phát âm
        const { analyzedWords, finalScore } = analyzePronunciation(currentTranscript, targetText);
        setWords(analyzedWords);
        setScore(finalScore); // Lưu điểm
      };

      newRecognition.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
        let errorMessage = "Đã xảy ra lỗi khi nhận diện giọng nói.";
        if (event.error === "not-allowed") {
          errorMessage = "Bạn cần cho phép trang web truy cập microphone.";
        } else if (event.error === "no-speech") {
          errorMessage = "Không nhận thấy giọng nói. Hãy thử nói lại.";
        } else if (event.error === "aborted") {
          errorMessage = "Quá trình nhận diện giọng nói đã bị hủy bỏ.";
        }
        setError(errorMessage);
        setIsListening(false);
      };

      newRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(newRecognition);
    } else {
      setError("Trình duyệt của bạn không hỗ trợ Web Speech API.");
    }

    return () => {
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
      }
    };
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  // Hàm phân tích phát âm (cải tiến)
  const analyzePronunciation = useCallback((spokenText: string, targetText: string) => {
    const targetWords = targetText.toLowerCase().split(" ");
    const spokenWords = spokenText.toLowerCase().split(" ");
    const analyzedWords = [];
    let correctCount = 0;
    const totalWords = targetWords.length;
    let wordScore = 0;

    for (let i = 0; i < totalWords; i++) {
      if (spokenWords[i] === targetWords[i]) {
        analyzedWords.push({ text: targetWords[i], color: "text-green-500" }); // Đúng
        correctCount++;
      } else if (spokenWords[i] && spokenWords[i].length > 0) {
        // Kiểm tra sự tương đồng (đơn giản hóa)
        let similarity = 0;
        for (let j = 0; j < Math.min(spokenWords[i].length, targetWords[i].length); j++) {
          if (spokenWords[i][j] === targetWords[i][j]) {
            similarity++;
          }
        }
        if (similarity >= targetWords[i].length * 0.5) {
          // Ngưỡng tương đồng (có thể điều chỉnh)
          analyzedWords.push({ text: targetWords[i], color: "text-yellow-500" }); // Gần đúng
        } else {
          analyzedWords.push({ text: targetWords[i], color: "text-red-500" }); // Sai
        }
      } else {
        analyzedWords.push({ text: targetWords[i], color: "text-red-500" }); // Sai
      }
    }
    wordScore = (correctCount / totalWords) * 100;
    return { analyzedWords, finalScore: Math.round(wordScore) };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Luyện phát âm tiếng Anh
        </h1>

        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Câu mẫu:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {words.map((word, index) => (
              <span key={index} className={cn(word.color, "whitespace-nowrap")}>
                {word.text}
              </span>
            ))}
          </div>
          <p className="text-gray-400 mb-4">Nhấn nút `Bắt đầu nói` và đọc to câu trên.</p>
          <div className="flex items-center gap-4">
            <Button
              onClick={startListening}
              disabled={isListening}
              className={cn(
                "px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300",
                isListening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  Đang nghe...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Bắt đầu nói
                </>
              )}
            </Button>
            <Button
              onClick={stopListening}
              disabled={!isListening}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-200"
            >
              Dừng lại
            </Button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Bài nói của bạn:</h2>
            <div
              className="bg-gray-700 rounded-md p-4 min-h-[80px] border border-gray-600 shadow-sm"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {transcript || <span className="text-gray-500">Hãy nói để xem kết quả...</span>}
            </div>
            {score !== null && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Điểm của bạn: {score} / 100</h3>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Giải thích:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>
              Trang web sử dụng <strong>Web Speech API</strong> để thu âm giọng nói của bạn.
            </li>
            <li>
              Sau khi bạn nói, trang web hiển thị đoạn văn bản (transcript) và đánh giá sơ bộ phát
              âm.
            </li>
            <li>
              Màu sắc của các từ cho biết: <span className="text-green-500">màu xanh lá</span> =
              đúng, <span className="text-yellow-500">màu vàng</span> = gần đúng,{" "}
              <span className="text-red-500">màu đỏ</span> = sai.
            </li>
            <li>Điểm số được tính dựa trên số lượng từ bạn phát âm đúng so với câu mẫu.</li>
            <li>
              <strong>Lưu ý:</strong> Đây là bản demo đơn giản. Việc chấm điểm chính xác cần phân
              tích âm vị và các yếu tố ngữ âm khác.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTest;
