export interface Lesson {
  id: number;
  letter: string;
  name: string;
  description?: string;
}

export interface Level {
  id: number;
  name: string;
  description?: string;
  lessons?: Lesson[];
}
