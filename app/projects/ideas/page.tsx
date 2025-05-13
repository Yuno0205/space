"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Volume2, AlertTriangle } from "lucide-react";
import { dictionary } from "cmu-pronouncing-dictionary";

type DictType = Record<string, string | string[]>;

interface WordDisplay {
  text: string;
  color: string;
}
interface DetailScores {
  phoneme: number;
  accentProxy: number;
  rhythmProxy: number;
  speed: number; // Represents completeness/coverage
}

const sampleSentences = [
  "Amazing",
  "Hello world",
  "Good morning",
  "Have a great day!",
  "What is your name?",
  "Where are you from?",
];

const SpeakingTest: React.FC = () => {
  const [targetText, setTargetText] = useState(sampleSentences[0]);
  const [words, setWords] = useState<WordDisplay[]>([]);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [detailScores, setDetailScores] = useState<DetailScores | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize words when target changes
  useEffect(() => {
    const initialWords = targetText
      .split(/\s+/)
      .filter(Boolean) // Ensure no empty strings if there are multiple spaces
      .map((w) => ({ text: w, color: "text-gray-300" }));
    setWords(initialWords);
    setTranscript("");
    setScore(null);
    setDetailScores(null);
    setError(null); // Clear previous errors on new sentence
  }, [targetText]);

  // Setup SpeechRecognition once
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Trình duyệt không hỗ trợ Web Speech API. Vui lòng thử Chrome hoặc Edge.");
      return;
    }
    const srInstance = new SpeechRecognitionAPI();
    srInstance.continuous = false; // Process after user stops speaking
    srInstance.interimResults = false; // Only final results
    srInstance.lang = "en-UK"; // Set language to English (UK)

    srInstance.onstart = () => {
      setIsListening(true);
      setError(null); // Clear previous errors
    };

    srInstance.onresult = (event: SpeechRecognitionEvent) => {
      console.log("REC: onresult - Result received!");
      {
        /* event.results là một danh sách các kết quả nhận diện (SpeechRecognitionResultList). 
        Danh sách này giống như một mảng, chứa các đối tượng SpeechRecognitionResult */
      }
      const bestAlternative = event.results[0][0]; // Lấy kết quả tốt nhất từ phần tử đầu tiên
      const spokenText = bestAlternative.transcript.trim(); // Lấy văn bản đã nói
      const confidence = bestAlternative.confidence; // Đây là điểm confidence (0.0 đến 1.0)

      setTranscript(spokenText);
      // Truyền cả confidence vào analyzePronunciation
      analyzePronunciation(targetText, spokenText, confidence);
    };

    srInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        setError("Không phát hiện được giọng nói. Vui lòng thử lại.");
      } else if (event.error === "audio-capture") {
        setError("Lỗi thu âm thanh. Kiểm tra micro của bạn.");
      } else if (event.error === "not-allowed") {
        setError("Quyền truy cập micro bị từ chối. Vui lòng cấp quyền.");
      } else {
        setError(`Lỗi nhận diện giọng nói: ${event.error}`);
      }
      setIsListening(false);
    };

    srInstance.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = srInstance;

    // Cleanup: abort any ongoing recognition when the component unmounts or before re-running the effect
    return () => {
      // Abort the recognition if it's still running
      recognitionRef.current?.abort();
    };
  }, []); // Empty dependency array: runs only once on mount

  /**
   * Retrieves phonemes for a given word from the CMU dictionary.
   * Handles cases where the dictionary entry might be an array of pronunciations.
   */
  const getPhonemes = (word: string): string => {
    if (!word || typeof word !== "string") {
      // Kiểm tra kỹ hơn kiểu dữ liệu
      console.log("GET_PHONEMES: Word is empty or not a string, returning empty string.");
      return "";
    }

    const lowerWord = word.toLowerCase().trim(); // Thêm .trim() để loại bỏ khoảng trắng thừa

    if (
      typeof dictionary !== "object" ||
      dictionary === null ||
      Object.keys(dictionary).length === 0
    ) {
      console.error("GET_PHONEMES: DICTIONARY IS NOT A POPULATED OBJECT OR NOT ACCESSIBLE HERE!");
      return "";
    }

    const phonemeEntry = (dictionary as DictType)[lowerWord];

    if (Array.isArray(phonemeEntry)) {
      // Nếu phonemeEntry là một mảng, lấy phần tử đầu tiên
      const result = phonemeEntry.length > 0 ? phonemeEntry[0] : "";
      return result;
    }

    const result = phonemeEntry || "";
    return result;
  };

  /**
   * Calculates Levenshtein distance between two strings and returns a similarity score (0-1).
   */
  const levenshteinSimilarity = (strA: string, strB: string): number => {
    const a = strA.toLowerCase(); // Case-insensitive for general similarity
    const b = strB.toLowerCase();
    const m = a.length;
    const n = b.length;

    if (m === 0 && n === 0) return 1; // Both empty
    if (m === 0 || n === 0) return 0; // One empty, other not

    const dp = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // Deletion
          dp[i][j - 1] + 1, // Insertion
          dp[i - 1][j - 1] + cost // Substitution
        );
      }
    }
    const distance = dp[m][n];
    return 1 - distance / Math.max(m, n);
  };

  /**
   * Analyzes the spoken text against the target text for pronunciation scoring.
   */
  const analyzePronunciation = (
    currentTargetText: string,
    spokenText: string,
    sttConfidence: number // Thêm tham số này
  ) => {
    //  filter(Boolean) sẽ loại bỏ tất cả các giá trị "falsy" ra khỏi mảng. Trong ngữ cảnh này,
    //  nó chủ yếu dùng để loại bỏ các chuỗi rỗng ("") mà có thể đã được tạo ra bởi phương thức split.
    const tgtWords = currentTargetText.toLowerCase().split(/\s+/).filter(Boolean);
    const spkWords = spokenText.toLowerCase().split(/\s+/).filter(Boolean);

    // 1. Word Accuracy and Display
    let correctWordCount = 0;
    const wordDisplays: WordDisplay[] = [];
    tgtWords.forEach((targetWord, i) => {
      const currentSpokenWord = spkWords[i] || ""; // Đổi tên biến để tránh nhầm lẫn với spokenText tổng
      const originalTargetWord = targetText.split(/\s+/).filter(Boolean)[i]; // Lấy từ gốc để hiển thị đúng case

      if (currentSpokenWord === targetWord) {
        wordDisplays.push({ text: originalTargetWord, color: "text-green-500" });
        correctWordCount++;
      } else if (currentSpokenWord) {
        // Case này là người nói đã nói một từ gì đó chứ không phải chuỗi rỗng,
        // chỉ là không đúng với từ mục tiêu
        // Tính toán "độ tương đồng Levenshtein" giữa từ người dùng nói và từ mục tiêu.
        // Hàm levenshteinSimilarity trả về một giá trị từ 0 đến 1 (1 là giống hệt, 0 là hoàn toàn khác).
        const similarity = levenshteinSimilarity(currentSpokenWord, targetWord);

        wordDisplays.push({
          text: originalTargetWord,
          color: similarity >= 0.7 ? "text-yellow-500" : "text-red-500",
        });
      } else {
        wordDisplays.push({ text: originalTargetWord, color: "text-red-500" });
      }
    });
    setWords(wordDisplays);
    const wordScore =
      tgtWords.length > 0 ? Math.round((correctWordCount / tgtWords.length) * 100) : 0;

    console.log("Điểm từ:", wordScore);

    // 2. Phoneme Score (Cải tiến với sttConfidence)
    let phonemeMatchContributionSum = 0;
    let wordsWithPhonemesCount = 0;

    tgtWords.forEach((targetWord, i) => {
      const currentSpokenWord = spkWords[i] || ""; // Từ được nói tương ứng
      const targetPhonemes = getPhonemes(targetWord); // P_target

      if (targetPhonemes) {
        // Chỉ tính điểm nếu từ mục tiêu có âm vị
        wordsWithPhonemesCount++;
        const spokenWordCanonicalPhonemes = getPhonemes(currentSpokenWord); // P_spoken_canonical

        let wordPhonemeSimilarity = 0; // Điểm tương đồng âm vị cơ bản
        if (spokenWordCanonicalPhonemes) {
          wordPhonemeSimilarity = levenshteinSimilarity(
            targetPhonemes,
            spokenWordCanonicalPhonemes
          );
        }
        // Nếu currentSpokenWord rỗng (không nói), wordPhonemeSimilarity sẽ là 0 do spokenWordCanonicalPhonemes rỗng

        // Điều chỉnh điểm dựa trên sttConfidence VÀ việc từ có được nhận diện đúng không
        if (targetWord === currentSpokenWord && currentSpokenWord !== "") {
          // Nếu STT nhận diện ĐÚNG TỪ, điểm âm vị của từ này sẽ bị ảnh hưởng bởi độ tự tin của STT.
          // Nếu STT rất tự tin (gần 1.0), điểm giữ nguyên cao.
          // Nếu STT kém tự tin, điểm sẽ giảm xuống, ngụ ý phát âm có thể chưa chuẩn.
          // Bạn có thể dùng sttConfidence, sttConfidence^2 (để phạt nặng hơn nếu confidence thấp), etc.
          phonemeMatchContributionSum +=
            wordPhonemeSimilarity * (sttConfidence > 0 ? sttConfidence : 0.1); // Đảm bảo confidence không quá thấp làm mất hết điểm
        } else {
          // Nếu STT nhận diện SAI TỪ, hoặc KHÔNG NÓI TỪ đó:
          // wordPhonemeSimilarity đã phản ánh sự khác biệt giữa âm vị của từ mục tiêu và từ (sai) được nói,
          // hoặc là 0 nếu không nói. Không cần nhân thêm với sttConfidence ở đây.
          phonemeMatchContributionSum += wordPhonemeSimilarity;
        }
      }
    });

    const phonemeScore =
      wordsWithPhonemesCount > 0
        ? Math.round((phonemeMatchContributionSum / wordsWithPhonemesCount) * 100)
        : 0;

    // 3. Accent Proxy (có thể cũng điều chỉnh bằng sttConfidence)
    // Ví dụ: làm cho nó nhạy hơn với phonemeScore đã được điều chỉnh
    const accentProxy = Math.min(
      100,
      Math.max(0, phonemeScore + Math.round(15 * (sttConfidence > 0 ? sttConfidence : 0.5) - 5))
    );

    // 4. Rhythm Proxy (giữ nguyên hoặc điều chỉnh nếu muốn)
    const rhythmProxy = Math.max(0, wordScore - 10);

    let speedScore = 100; // << KHỞI TẠO BẰNG 100
    // ... (logic tính speedScore như cũ) ...
    if (tgtWords.length > 0) {
      const rate = spkWords.length / tgtWords.length;
      if (rate < 0.7) {
        // Trường hợp 1
        speedScore = Math.round(100 * rate * rate);
      } else if (rate > 1.3) {
        // Trường hợp 2
        speedScore = Math.round(100 - (rate - 1.3) * 150);
      }
      // << THIẾU TRƯỜNG HỢP ELSE Ở ĐÂY >>
      // Nếu rate nằm trong khoảng [0.7, 1.3], không có điều kiện nào được khớp,
      // speedScore sẽ giữ nguyên giá trị khởi tạo là 100.
    } else if (spkWords.length > 0) {
      speedScore = 0;
    }
    speedScore = Math.max(0, Math.min(100, speedScore));

    // Final Score Calculation
    const finalScore = Math.round(
      phonemeScore * 0.5 + // Tăng trọng số cho phonemeScore đã được điều chỉnh
        accentProxy * 0.2 +
        rhythmProxy * 0.1 + // Giảm nhẹ rhythm proxy
        speedScore * 0.2
    );

    setScore(finalScore);
    setDetailScores({
      phoneme: phonemeScore,
      accentProxy,
      rhythmProxy,
      speed: speedScore,
    });
  };

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e: unknown) {
        // Catch DOMException if start() is called too soon after a previous stop(), etc.
        console.error("Error starting recognition:", e);
        if (e instanceof Error && e.name === "InvalidStateError") {
          setError("Lỗi trạng thái nhận diện, vui lòng thử lại sau giây lát.");
        } else {
          setError("Không thể bắt đầu nhận diện giọng nói.");
        }
        setIsListening(false); // Ensure state consistency
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };
  // Function to handle speaking the sample sentence
  const handleSpeakSample = () => {
    if (!window.speechSynthesis) {
      setError("Trình duyệt không hỗ trợ phát âm mẫu (Speech Synthesis).");
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel(); // Stop any ongoing speech before starting new one
    }
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = "en-UK";
    // Optional: find and set a specific voice
    // const voices = speechSynthesis.getVoices();
    // const enVoice = voices.find(voice => voice.lang === "en-US");
    // if (enVoice) utterance.voice = enVoice;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-sky-400 mb-8">
          Luyện phát âm tiếng Anh
        </h1>

        {error && (
          <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-sky-300">Câu mẫu:</span>
            <Button
              size="icon"
              variant="outline"
              onClick={handleSpeakSample}
              title="Nghe câu mẫu"
              className="bg-sky-600 hover:bg-sky-700 border-sky-500"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
          <select
            className="mt-2 w-full bg-gray-700 p-3 rounded border border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
          >
            {sampleSentences.map((sentence) => (
              <option key={sentence} value={sentence}>
                {sentence}
              </option>
            ))}
          </select>
          <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 min-h-[3em] items-center p-2 bg-gray-700 rounded">
            {words.map((wordData, index) => (
              <span key={index} className={cn(wordData.color, "text-xl md:text-2xl font-medium")}>
                {wordData.text}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartListening}
            disabled={isListening}
            className="bg-green-600 hover:bg-green-700 text-lg px-6 py-3 w-full sm:w-auto"
          >
            <Mic className="w-5 h-5 mr-2" />
            Bắt đầu nói
          </Button>
          <Button
            onClick={handleStopListening}
            variant="secondary"
            disabled={!isListening}
            className="bg-red-600 hover:bg-red-700 text-lg px-6 py-3 w-full sm:w-auto"
          >
            {/* Consider using MicOff if you want to show a different icon state */}
            Dừng lại
          </Button>
        </div>

        {transcript && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-sky-300 font-semibold">Bạn đã nói:</p>
            <p className="italic text-lg">“{transcript}”</p>
          </div>
        )}

        {score !== null && detailScores && (
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Kết quả đánh giá:</h2>
            <p className="text-2xl mb-4">
              Điểm tổng:{" "}
              <span
                className={cn(
                  "font-bold",
                  score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"
                )}
              >
                {score}
              </span>
              /100
            </p>
            <ul className="space-y-1 text-gray-300">
              <li>Âm vị (Phoneme): {detailScores.phoneme}/100</li>
              <li>Giọng điệu (Accent Proxy): {detailScores.accentProxy}/100</li>
              <li>Nhịp điệu (Rhythm Proxy): {detailScores.rhythmProxy}/100</li>
              <li>Tốc độ/Đầy đủ (Speed/Coverage): {detailScores.speed}/100</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingTest;
