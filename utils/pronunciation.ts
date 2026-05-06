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

  let accuracyScoreSum = 0;

  const wordsForDisplay = tgtWordsOriginal.map((originalTargetWord, i) => {
    const targetWordLower = tgtWordsLower[i];
    const spokenWordLower = spkWordsLower[i] || "";

    if (spokenWordLower === targetWordLower) {
      accuracyScoreSum += 1;
      return { text: originalTargetWord, color: "text-green-500" };
    }

    if (spokenWordLower) {
      const similarity = levenshteinSimilarity(spokenWordLower, targetWordLower);

      if (similarity >= 0.7) {
        accuracyScoreSum += similarity;
        return { text: originalTargetWord, color: "text-yellow-500" };
      }

      return { text: originalTargetWord, color: "text-red-500" };
    }

    return { text: originalTargetWord, color: "text-red-500" };
  });

  const accuracyScore =
    tgtWordsLower.length > 0 ? Math.round((accuracyScoreSum / tgtWordsLower.length) * 100) : 0;

  let pronunciationScoreSum = 0;
  let wordsWithPhonemesCount = 0;

  tgtWordsLower.forEach((targetWord, i) => {
    const spokenWord = spkWordsLower[i] || "";
    const targetPhonemes = getPhonemes(targetWord);

    if (!targetPhonemes) return;

    wordsWithPhonemesCount++;

    if (targetWord === spokenWord && spokenWord !== "") {
      pronunciationScoreSum += 1;
      return;
    }

    const spokenPhonemes = getPhonemes(spokenWord);
    const phonemeSimilarity = spokenPhonemes
      ? levenshteinSimilarity(targetPhonemes, spokenPhonemes)
      : 0;

    pronunciationScoreSum += phonemeSimilarity;
  });

  const pronunciationScore =
    wordsWithPhonemesCount > 0
      ? Math.round((pronunciationScoreSum / wordsWithPhonemesCount) * 100)
      : spkWordsLower.length === 0
        ? 0
        : 50;

  const completenessScore =
    tgtWordsLower.length > 0
      ? Math.round(
          (Math.min(spkWordsLower.length, tgtWordsLower.length) / tgtWordsLower.length) * 100
        )
      : 0;

  const confidenceScore = Math.round((sttConfidence || 0.5) * 100);

  const overallScore = Math.round(
    accuracyScore * 0.35 +
      pronunciationScore * 0.35 +
      completenessScore * 0.2 +
      confidenceScore * 0.1
  );

  return {
    overallScore,
    wordsForDisplay,
    details: {
      accuracy: accuracyScore,
      pronunciation: pronunciationScore,
      completeness: completenessScore,
      confidence: confidenceScore,
    },
  };
};
