import { WordDisplay } from "@/types/pronunciation";

export const createNeutralWordDisplay = (targetText: string): WordDisplay[] =>
  targetText
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, color: "text-gray-300" }));
