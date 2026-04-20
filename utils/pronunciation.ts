import { dictionary } from "cmu-pronouncing-dictionary";
import { normalizeToken } from ".";

type DictType = Record<string, string | string[]>;

/**
 * get phonemes from cmu dictionary
 */
export const getPhonemes = (word: string): string => {
  if (!word || typeof word !== "string") return "";
  const lowerWord = word
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "");
  if (!lowerWord) return "";

  const phonemeEntry = (dictionary as DictType)[lowerWord];
  if (Array.isArray(phonemeEntry)) return phonemeEntry.length > 0 ? phonemeEntry[0] : "";
  return phonemeEntry || "";
};

/**
 * calculate levenshtein similarity between two strings (0 to 1)
 */
export const levenshteinSimilarity = (strA: string, strB: string): number => {
  const a = strA.toLowerCase();
  const b = strB.toLowerCase();
  if (!a.length && !b.length) return 1;
  if (!a.length || !b.length) return 0;

  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length);
};

/**
 * main engine: analyze speech and return detailed scores
 */
export const analyzeSpeech = (targetText: string, spokenText: string, sttConfidence: number) => {
  const tgtWordsOriginal = targetText.split(/\s+/).filter(Boolean);
  const tgtWordsLower = targetText.split(/\s+/).map(normalizeToken).filter(Boolean);
  const spkWordsLower = spokenText.split(/\s+/).map(normalizeToken).filter(Boolean);

  let correctWordCount = 0;

  // 1. analyze word color display
  const wordsForDisplay = tgtWordsOriginal.map((originalTargetWord, i) => {
    const targetWordLower = tgtWordsLower[i];
    const spokenWordLower = spkWordsLower[i] || "";

    if (spokenWordLower === targetWordLower) {
      correctWordCount++;
      return { text: originalTargetWord, color: "text-green-500" };
    } else if (spokenWordLower) {
      const similarity = levenshteinSimilarity(spokenWordLower, targetWordLower);
      return {
        text: originalTargetWord,
        color: similarity >= 0.7 ? "text-yellow-500" : "text-red-500",
      };
    }
    return { text: originalTargetWord, color: "text-red-500" };
  });

  // 2. calculate component scores
  const wordScore =
    tgtWordsLower.length > 0 ? Math.round((correctWordCount / tgtWordsLower.length) * 100) : 0;

  let phonemeMatchSum = 0;
  let wordsWithPhonemesCount = 0;

  tgtWordsLower.forEach((targetWord, i) => {
    const currentSpokenWord = spkWordsLower[i] || "";
    const targetPhonemes = getPhonemes(targetWord);

    if (targetPhonemes) {
      wordsWithPhonemesCount++;
      const spokenPhonemes = getPhonemes(currentSpokenWord);
      const wordPhonemeSim = spokenPhonemes
        ? levenshteinSimilarity(targetPhonemes, spokenPhonemes)
        : 0;

      if (targetWord === currentSpokenWord && currentSpokenWord !== "") {
        phonemeMatchSum += wordPhonemeSim * (sttConfidence > 0 ? sttConfidence : 0.1);
      } else {
        phonemeMatchSum += wordPhonemeSim;
      }
    }
  });

  const phonemeScore =
    wordsWithPhonemesCount > 0
      ? Math.round((phonemeMatchSum / wordsWithPhonemesCount) * 100)
      : spkWordsLower.length === 0
        ? 0
        : 50;

  const accentScore = Math.min(
    100,
    Math.max(0, phonemeScore + Math.round(15 * (sttConfidence || 0.5) - 5))
  );
  const rhythmScore = Math.max(0, wordScore - 10);

  let speedScore = 100;
  if (tgtWordsLower.length > 0) {
    const rate = spkWordsLower.length / tgtWordsLower.length;
    speedScore =
      rate < 0.7
        ? Math.round(100 * rate * rate)
        : rate > 1.3
          ? Math.round(100 - (rate - 1.3) * 150)
          : 100;
  }
  speedScore = Math.max(0, Math.min(100, speedScore));

  // 3. total final score
  const overallScore = Math.round(
    phonemeScore * 0.5 + accentScore * 0.2 + rhythmScore * 0.1 + speedScore * 0.2
  );

  return {
    overallScore,
    wordsForDisplay,
    details: {
      phoneme: phonemeScore,
      accent: accentScore,
      rhythm: rhythmScore,
      speed: speedScore,
    },
  };
};
