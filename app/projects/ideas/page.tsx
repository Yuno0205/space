"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Volume2, AlertTriangle } from "lucide-react"; // MicOff was not used, removed for now

// Import CMU Pronouncing Dictionary as named export
import { dictionary } from "cmu-pronouncing-dictionary";
console.log("CMU Dictionary type:", typeof dictionary);
if (typeof dictionary === "object" && dictionary !== null) {
  console.log("CMU Dictionary keys count:", Object.keys(dictionary).length);
  // Log một vài từ mẫu xem có trong dictionary không
  console.log("Dictionary entry for 'THE':", (dictionary as any)["THE"]);
  console.log("Dictionary entry for 'abandon':", (dictionary as any)["abandon"]);
} else {
  console.error("CMU Dictionary is not loaded or is not an object!");
}

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

const sampleSentences = ["abandon"];

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
    srInstance.lang = "en-US";

    srInstance.onstart = () => {
      setIsListening(true);
      setError(null); // Clear previous errors
    };

    srInstance.onresult = (event: SpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript.trim();
      setTranscript(spokenText);
      analyzePronunciation(targetText, spokenText);
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

    if (typeof dictionary === "object" && dictionary !== null) {
      const keys = Object.keys(dictionary);
      if (keys.length > 0) {
        console.log("DICTIONARY_DEBUG: First 20 keys:", keys.slice(0, 20));
        // Thử tìm một từ cụ thể bằng cách lặp qua các key
        let foundTheKey = null;
        for (const key of keys) {
          if (key.toUpperCase() === "THE") {
            // So sánh không phân biệt hoa thường để tìm
            foundTheKey = key;
            break;
          }
        }
        if (foundTheKey) {
          console.log(
            `DICTIONARY_DEBUG: Found 'THE' as key: '${foundTheKey}'. Value:`,
            (dictionary as any)[foundTheKey]
          );
        } else {
          console.log("DICTIONARY_DEBUG: 'THE' not found by iterating keys.");
        }
      }
    }

    // Cleanup: abort any ongoing recognition when the component unmounts or before re-running the effect
    return () => {
      recognitionRef.current?.abort();
    };
  }, []); // Empty dependency array: runs only once on mount

  /**
   * Retrieves phonemes for a given word from the CMU dictionary.
   * Handles cases where the dictionary entry might be an array of pronunciations.
   */
  const getPhonemes = (word: string): string => {
    console.log(`GET_PHONEMES: ---- Called with word: "${word}" (Type: ${typeof word}) ----`);
    if (!word || typeof word !== "string") {
      // Kiểm tra kỹ hơn kiểu dữ liệu
      console.log("GET_PHONEMES: Word is empty or not a string, returning empty string.");
      return "";
    }

    const lowerWord = word.toLowerCase().trim(); // Thêm .trim() để loại bỏ khoảng trắng thừa
    console.log(`GET_PHONEMES: lowerWord for lookup: "${lowerWord}"`);

    if (
      typeof dictionary !== "object" ||
      dictionary === null ||
      Object.keys(dictionary).length === 0
    ) {
      console.error("GET_PHONEMES: DICTIONARY IS NOT A POPULATED OBJECT OR NOT ACCESSIBLE HERE!");
      return "";
    }

    // Log thử truy cập trực tiếp với một key chắc chắn đúng (chữ thường) từ dictionary
    // console.log("GET_PHONEMES: Manual test for 'abandon' in this scope:", (dictionary as DictType)['abandon']);

    const phonemeEntry = (dictionary as DictType)[lowerWord];
    console.log(`GET_PHONEMES: Entry for "${lowerWord}" from dictionary is:`, phonemeEntry);

    if (Array.isArray(phonemeEntry)) {
      console.log(`GET_PHONEMES: Entry is an array. Length: ${phonemeEntry.length}`);
      const result = phonemeEntry.length > 0 ? phonemeEntry[0] : "";
      console.log(`GET_PHONEMES: Returning from array case: "${result}"`);
      return result;
    }

    const result = phonemeEntry || "";
    console.log(`GET_PHONEMES: Returning from string/undefined case: "${result}"`);
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
  const analyzePronunciation = (currentTargetText: string, spokenText: string) => {
    const tgtWords = currentTargetText.toLowerCase().split(/\s+/).filter(Boolean);
    const spkWords = spokenText.toLowerCase().split(/\s+/).filter(Boolean);

    // 1. Word Accuracy and Display
    let correctWordCount = 0;
    const wordDisplays: WordDisplay[] = [];
    tgtWords.forEach((targetWord, i) => {
      const spokenWord = spkWords[i] || ""; // Get corresponding spoken word, or empty if not spoken

      if (spokenWord === targetWord) {
        wordDisplays.push({
          text: targetText.split(/\s+/).filter(Boolean)[i],
          color: "text-green-500",
        });
        correctWordCount++;
      } else if (spokenWord) {
        // If a word was spoken but it's not a perfect match
        const similarity = levenshteinSimilarity(spokenWord, targetWord);
        wordDisplays.push({
          text: targetText.split(/\s+/).filter(Boolean)[i],
          color: similarity >= 0.7 ? "text-yellow-500" : "text-red-500",
        });
      } else {
        // Word was expected but not spoken
        wordDisplays.push({
          text: targetText.split(/\s+/).filter(Boolean)[i],
          color: "text-red-500",
        });
      }
    });
    setWords(wordDisplays);
    const wordScore =
      tgtWords.length > 0 ? Math.round((correctWordCount / tgtWords.length) * 100) : 0;

    // 2. Phoneme Score (using Levenshtein similarity for phoneme sequences)
    let phonemeMatchSum = 0;
    let wordsWithPhonemesCount = 0;

    console.log("--- Testing getPhonemes ---");
    console.log("Phonemes for 'Abandon':", getPhonemes("Abandon"));
    console.log("Phonemes for 'the':", getPhonemes("the"));
    console.log("Phonemes for 'mission':", getPhonemes("mission"));

    tgtWords.forEach((targetWord, i) => {
      const spokenWord = spkWords[i] || "";
      const targetPhonemes = getPhonemes(targetWord);

      if (targetPhonemes) {
        // Only score if the target word has a known phoneme representation
        wordsWithPhonemesCount++;
        const spokenPhonemes = getPhonemes(spokenWord);
        if (spokenPhonemes) {
          const phonemeSeqSimilarity = levenshteinSimilarity(spokenPhonemes, targetPhonemes);
          phonemeMatchSum += phonemeSeqSimilarity;
        } else {
          phonemeMatchSum += 0; // Penalize if spoken word has no phonemes or wasn't spoken
        }
      }
    });
    const phonemeScore =
      wordsWithPhonemesCount > 0 ? Math.round((phonemeMatchSum / wordsWithPhonemesCount) * 100) : 0;

    // 3. Accent Proxy (heuristic)
    const accentProxy = Math.min(100, phonemeScore + 10); // Slight boost over phoneme score

    // 4. Rhythm Proxy (heuristic)
    const rhythmProxy = Math.max(0, wordScore - 10); // Based on word accuracy

    // 5. Speed Score (more like completeness/coverage)
    let speedScore = 100;
    if (tgtWords.length > 0) {
      const rate = spkWords.length / tgtWords.length;
      if (rate < 0.7) {
        // Spoke too few words
        speedScore = Math.round(100 * rate * rate); // Sharper penalty for very few words
      } else if (rate > 1.3) {
        // Spoke too many words
        // Penalize more for extra words: (rate - 1.3) is the excess ratio
        // Max penalty if rate is e.g. 2.0 (double words) -> (0.7 * 150) = 105 -> score becomes 0
        speedScore = Math.round(100 - (rate - 1.3) * 150);
      }
      // If rate is between 0.7 and 1.3, speedScore remains high (close to 100)
      // Can add smoother transition here if desired.
      // For example, if 0.7 <= rate <= 1.3, speedScore = 100 - Math.abs(1-rate)*50
    } else if (spkWords.length > 0) {
      speedScore = 0; // Target was empty, but user spoke.
    } // If both are 0, speed is 100 (or could be 0, depends on desired logic)
    speedScore = Math.max(0, Math.min(100, speedScore));

    // Final Score Calculation (weights can be adjusted)
    const finalScore = Math.round(
      phonemeScore * 0.45 + // Increased weight for phonemes
        accentProxy * 0.2 +
        rhythmProxy * 0.15 + // Reduced weight for rhythm proxy
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
      } catch (e: any) {
        // Catch DOMException if start() is called too soon after a previous stop(), etc.
        console.error("Error starting recognition:", e);
        if (e.name === "InvalidStateError") {
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

  const handleSpeakSample = () => {
    if (!window.speechSynthesis) {
      setError("Trình duyệt không hỗ trợ phát âm mẫu (Speech Synthesis).");
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel(); // Stop any ongoing speech before starting new one
    }
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = "en-US";
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
