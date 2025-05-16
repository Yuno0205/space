interface Proficiently {
  flashcard: boolean;
  speaking: boolean;
  listening: boolean;
  writing: boolean;
  [key: string]: boolean; // Nếu bạn muốn cho phép thêm các kỹ năng khác động
}

export type VocabularyCard = {
  id: string;
  word: string;
  phonetic?: string;
  audio_url?: string;
  word_type?: string;
  definition?: string;
  translation?: string;
  example: string;
  synonyms?: string;
  antonyms?: string;
  proficiently?: Proficiently;
};
