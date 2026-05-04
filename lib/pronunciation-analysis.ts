export type WordDisplay = {
  text: string;
  color: string;
};

type DetailScores = {
  phoneme: number;
  accent: number;
  rhythm: number;
  speed: number;
};

export type PronunciationAnalysisResult = {
  transcript: string;
  overallScore: number | null;
  detailScores: DetailScores | null;
  wordsForDisplay: WordDisplay[];
};

export const createNeutralWordDisplay = (targetText: string): WordDisplay[] =>
  targetText
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, color: "text-gray-300" }));
