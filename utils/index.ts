import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { dictionary } from "cmu-pronouncing-dictionary";

// Merge class func
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export const normalizeToken = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accent
    .replace(/[^\w']/g, "")
    .trim();

// Map ARPAbet → IPA
const arpabetToIPA: Record<string, string> = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  EH: "ɛ",
  ER: "ɜr",
  EY: "eɪ",
  F: "f",
  G: "ɡ",
  HH: "h",
  IH: "ɪ",
  IY: "iː",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  OW: "oʊ",
  OY: "ɔɪ",
  P: "p",
  R: "r",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  UH: "ʊ",
  UW: "uː",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

function arpabetWordToIPA(word: string): string {
  const arpabet = dictionary[word.toLowerCase()];
  if (!arpabet) return word; // fallback nếu không có trong dict

  return (
    "/" +
    arpabet
      .split(" ")
      .map((phoneme) => arpabetToIPA[phoneme.replace(/[0-9]/g, "")] ?? phoneme)
      .join("") +
    "/"
  );
}

export function sentenceToIPA(sentence: string): string {
  const tokens = sentence.match(/[\w']+|[^\w\s]/g) ?? [];

  return tokens.map((token) => (/[\w']+/.test(token) ? arpabetWordToIPA(token) : token)).join(" ");
}
