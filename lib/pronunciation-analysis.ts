import { analyzeSpeech } from "@/utils/pronunciation";

export type WordDisplay = {
  text: string;
  color: string;
};

type DetailScores = {
  phoneme: number;
  accentProxy: number;
  rhythmProxy: number;
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

export const buildPronunciationAnalysis = (
  targetText: string,
  spokenText: string,
  sttConfidence: number
): PronunciationAnalysisResult => {
  const analyzed = analyzeSpeech(targetText, spokenText, sttConfidence);

  return {
    transcript: spokenText,
    overallScore: analyzed.overallScore,
    detailScores: {
      phoneme: analyzed.details.phoneme,
      accentProxy: analyzed.details.accent,
      rhythmProxy: analyzed.details.rhythm,
      speed: analyzed.details.speed,
    },
    wordsForDisplay: analyzed.wordsForDisplay,
  };
};
