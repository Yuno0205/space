export type DetailScores = {
  accuracy: number;
  pronunciation: number;
  confidence: number;
  completeness: number;
};

export type WordDisplay = {
  text: string;
  color: string;
};

export interface PronunciationResultState {
  wordsForDisplay: WordDisplay[];
  transcript: string;
  overallScore: number | null;
  detailScores: DetailScores | null;
  error?: string | null;
  isListening?: boolean;
}
