import React, { useState, useEffect, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import stringSimilarity from "string-similarity";
import Highlighter from "react-highlight-words";

interface PronunciationCheckerProps {
  targetText: string; // Chuỗi mẫu để đối chiếu phát âm
  onScoreChange?: (score: number) => void; // Callback khi điểm số thay đổi
}

interface WordScore {
  word: string;
  score: number;
  color: string;
}

const PronunciationChecker: React.FC<PronunciationCheckerProps> = ({
  targetText,
  onScoreChange,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [wordScores, setWordScores] = useState<WordScore[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [highlightWords, setHighlightWords] = useState<string[]>([]);
  const [highlightColors, setHighlightColors] = useState<Record<string, string>>({});

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // Kiểm tra hỗ trợ nhận dạng giọng nói
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.
      </div>
    );
  }

  // Xử lý khi transcript thay đổi
  useEffect(() => {
    if (transcript && !listening && targetText) {
      evaluatePronunciation(transcript, targetText);
    }
  }, [transcript, listening, targetText]);

  // Cập nhật trạng thái nghe dựa trên SpeechRecognition
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Phương thức đánh giá phát âm
  const evaluatePronunciation = (spoken: string, target: string) => {
    // Tách thành các từ
    const targetWords = target.toLowerCase().split(/\s+/);
    const spokenWords = spoken.toLowerCase().split(/\s+/);

    // Tạo mảng lưu điểm số cho từng từ
    const newWordScores: WordScore[] = [];
    const newHighlightWords: string[] = [];
    const newHighlightColors: Record<string, string> = {};

    // Tính tổng điểm
    let totalScore = 0;

    // So sánh từng từ
    targetWords.forEach((targetWord, index) => {
      // Lấy từ tương ứng nếu có
      const spokenWord = index < spokenWords.length ? spokenWords[index] : "";

      // Tính điểm tương đồng (0-1)
      const similarity = stringSimilarity.compareTwoStrings(targetWord, spokenWord);

      // Chuyển điểm thành thang điểm 10
      const score = Math.round(similarity * 10);

      // Xác định màu dựa trên điểm số
      let color = "red"; // Mặc định là đỏ (kém)
      if (score >= 9) {
        color = "green"; // Tốt
      } else if (score >= 6) {
        color = "orange"; // Trung bình
      }

      // Thêm từ vào danh sách từ cần highlight
      newHighlightWords.push(targetWord);
      newHighlightColors[targetWord] = color;

      // Lưu kết quả
      newWordScores.push({
        word: targetWord,
        score,
        color,
      });

      // Cộng vào tổng điểm
      totalScore += score;
    });

    // Tính điểm trung bình
    const averageScore = totalScore / targetWords.length;

    // Cập nhật state
    setWordScores(newWordScores);
    setOverallScore(averageScore);
    setHighlightWords(newHighlightWords);
    setHighlightColors(newHighlightColors);

    // Gọi callback nếu có
    if (onScoreChange) {
      onScoreChange(averageScore);
    }
  };

  // Bắt đầu nghe
  const startListening = useCallback(() => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: false,
      language: "en-US", // Thiết lập ngôn ngữ là tiếng Anh
    });
  }, [resetTranscript]);

  // Dừng nghe
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  // Tạo lại
  const handleReset = useCallback(() => {
    resetTranscript();
    setWordScores([]);
    setOverallScore(0);
    setHighlightWords([]);
    setHighlightColors({});
  }, [resetTranscript]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Hiển thị văn bản mẫu với highlight */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Văn bản mục tiêu:</h3>
        <div className="p-4 bg-gray-50 rounded">
          {wordScores.length > 0 ? (
            <div>
              {wordScores.map((wordScore, idx) => (
                <span key={idx} className="inline-block mr-1" style={{ color: wordScore.color }}>
                  {wordScore.word}
                </span>
              ))}
            </div>
          ) : (
            <p>{targetText}</p>
          )}
        </div>
      </div>

      {/* Hiển thị kết quả nhận dạng */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Phát âm của bạn:</h3>
        <div className="p-4 bg-gray-50 rounded min-h-16">{transcript || "(Chưa có ghi âm)"}</div>
      </div>

      {/* Hiển thị điểm số */}
      {overallScore > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Điểm số:</h3>
          <div
            className="text-2xl font-bold p-4 rounded text-center"
            style={{
              backgroundColor:
                overallScore >= 8 ? "#d1fae5" : overallScore >= 6 ? "#ffedd5" : "#fee2e2",
            }}
          >
            {overallScore.toFixed(1)}/10
          </div>
        </div>
      )}

      {/* Nút điều khiển */}
      <div className="flex justify-between gap-4">
        {!isListening ? (
          <button
            onClick={startListening}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Bắt đầu nói
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Dừng nghe
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
};

export default PronunciationChecker;
