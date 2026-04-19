interface Proficiently {
  flashcard: boolean;
  speaking: boolean;
  listening: boolean;
  writing: boolean;
  [key: string]: boolean;
}

export type VocabularyCard = {
  id: string;
  word: string;
  phonetic?: string;
  audio_url?: string;
  word_type?: string;
  definition?: string;
  translation?: string;
  example?: string;
  synonyms?: string;
  antonyms?: string;
  level?: string;
  proficiently?: Proficiently;
};
