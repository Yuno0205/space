export interface Lesson {
  id: number;
  letter: string;
  name: string;
  description?: string;
}

export interface LessonWithProgress extends Lesson {
  learned_words: number;
  total_words: number;
  progress: number; // 0 → 1
}

export interface Level {
  id: number;
  name: string;
  description?: string;
  lessons?: Lesson[];
}
