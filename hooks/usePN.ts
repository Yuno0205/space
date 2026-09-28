import { PronunciationResultState } from "@/types/pronunciation";
import { analyzeSpeech, createNeutralWordDisplay } from "@/utils/pronunciation";
import { useRef, useState } from "react";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

export const initialPronunciationResultState: PronunciationResultState = {
  wordsForDisplay: [],
  transcript: "",
  overallScore: null,
  detailScores: null,
  error: null,
  isListening: false,
};

const usePronunciationRecognition = (word: string) => {
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResultState>(() => ({
    ...initialPronunciationResultState,
    wordsForDisplay: createNeutralWordDisplay(word),
  }));

  const { stopAudio } = useSpeechSynthesis();

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const analyzePronunciation = (word: string, spokenText: string, confidence: number) => {
    const result = analyzeSpeech(word, spokenText, confidence);

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: spokenText,
      overallScore: result.overallScore,
      detailScores: result.details,
      wordsForDisplay: result.wordsForDisplay,
    }));
  };

  const startListening = () => {
    if (pronunciationResult.isListening) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setPronunciationResult((prev) => ({
        ...prev,
        error: "Your browser does not support the Web Speech API. Please try Chrome or Edge.",
      }));

      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-GB";

      recognition.onstart = () => {
        setPronunciationResult((prev) => ({
          ...prev,
          isListening: true,
          error: null,
        }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const bestAlternative = event.results[0][0];

        const spokenText = bestAlternative.transcript.trim();

        analyzePronunciation(word, spokenText, bestAlternative.confidence);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorText = `Speech recognition error: ${event.error}`;

        if (event.error === "no-speech") {
          errorText = "No speech detected. Please try again.";
        } else if (event.error === "audio-capture") {
          errorText = "Microphone not found. Please check your device.";
        } else if (event.error === "not-allowed") {
          errorText = "Microphone access denied. Please grant permission.";
        }

        setPronunciationResult((prev) => ({
          ...prev,
          isListening: false,
          error: errorText,
        }));
      };

      recognition.onend = () => {
        setPronunciationResult((prev) => ({
          ...prev,
          isListening: false,
        }));
      };

      recognitionRef.current = recognition;
    }

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: "",
      overallScore: null,
      detailScores: null,
      wordsForDisplay: createNeutralWordDisplay(word),
      error: null,
    }));

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && pronunciationResult.isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetCurrentAttempt = () => {
    stopAudio();

    recognitionRef.current?.abort();

    setPronunciationResult({
      ...initialPronunciationResultState,
      wordsForDisplay: createNeutralWordDisplay(word),
    });
  };

  return { startListening, stopListening, resetCurrentAttempt, pronunciationResult };
};
