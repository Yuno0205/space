/// src/utils/phonemeAnalyzer.ts
import Meyda from "meyda";

// Mapping between IPA symbols and English ARPAbet phonemes
const IPAToEnglishPhonemeMap: Record<string, string> = {
  ɪ: "IH",
  i: "IY",
  e: "EY",
  ɛ: "EH",
  æ: "AE",
  ʌ: "AH",
  ɑ: "AA",
  ɔ: "AO",
  o: "OW",
  u: "UW",
  ʊ: "UH",
  ə: "AX",
  p: "P",
  b: "B",
  t: "T",
  d: "D",
  k: "K",
  g: "G",
  f: "F",
  v: "V",
  θ: "TH",
  ð: "DH",
  s: "S",
  z: "Z",
  ʃ: "SH",
  ʒ: "ZH",
  h: "HH",
  m: "M",
  n: "N",
  ŋ: "NG",
  l: "L",
  r: "R",
  w: "W",
  j: "Y",
  tʃ: "CH",
  dʒ: "JH",
};

export interface PhonemeMapping {
  ipa: string;
  englishPhoneme: string;
}

/**
 * Convert IPA string to an array of ARPAbet phonemes.
 */
export function convertIPAToPhonemes(ipaString: string): PhonemeMapping[] {
  const clean = ipaString.replace(/[\/()\[\]]/g, "");
  const phonemes: PhonemeMapping[] = [];
  let i = 0;
  while (i < clean.length) {
    // Check two-character IPA phonemes
    if (i < clean.length - 1) {
      const two = clean.substring(i, i + 2);
      if (IPAToEnglishPhonemeMap[two]) {
        phonemes.push({ ipa: two, englishPhoneme: IPAToEnglishPhonemeMap[two] });
        i += 2;
        continue;
      }
    }
    // Skip stress markers
    if (clean[i] === "ˈ" || clean[i] === "ˌ" || clean[i] === ".") {
      i++;
      continue;
    }
    // Single-character phoneme
    const symbol = clean[i];
    const mapped = IPAToEnglishPhonemeMap[symbol];
    if (mapped) {
      phonemes.push({ ipa: symbol, englishPhoneme: mapped });
    }
    i++;
  }
  return phonemes;
}

export interface AudioAnalyzer {
  setupMicrophone: () => Promise<{
    analyzer: Meyda.MeydaAnalyzer;
    microphone: MediaStreamAudioSourceNode;
  }>;
  startAnalysis: () => void;
  stopAnalysis: () => void;
}

/**
 * Initialize Meyda analyzer for live audio feature extraction.
 */
export function setupAudioAnalysis(audioContext?: AudioContext): AudioAnalyzer {
  const context = audioContext ?? new (window.AudioContext || (window as any).webkitAudioContext)();
  let analyzer: Meyda.MeydaAnalyzer | null = null;
  let microphone: MediaStreamAudioSourceNode | null = null;

  async function setupMicrophone(): Promise<{
    analyzer: Meyda.MeydaAnalyzer;
    microphone: MediaStreamAudioSourceNode;
  }> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphone = context.createMediaStreamSource(stream);
    analyzer = Meyda.createMeydaAnalyzer({
      audioContext: context,
      source: microphone,
      bufferSize: 512,
      featureExtractors: ["mfcc", "spectralCentroid", "spectralFlatness", "zcr"],
      callback: (features) => {
        // Process features or buffer them for later
        console.log("Audio features:", features);
      },
    });
    return { analyzer: analyzer!, microphone: microphone! };
  }

  function startAnalysis(): void {
    analyzer?.start();
  }

  function stopAnalysis(): void {
    analyzer?.stop();
  }

  return { setupMicrophone, startAnalysis, stopAnalysis };
}
