"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DetailScores, PronunciationResultState } from "@/types/pronunciation";
import { analyzeSpeech, createNeutralWordDisplay } from "@/utils/pronunciation";

export type PronunciationRecognitionResult = {
  spokenText: string;
  sttConfidence: number;
  score: number;
};

type UsePronunciationRecognitionOptions = {
  targetText: string;
  language?: string;
  onResult?: (result: PronunciationRecognitionResult) => void | Promise<void>;
};

function createInitialResult(targetText: string): PronunciationResultState {
  return {
    wordsForDisplay: createNeutralWordDisplay(targetText),
    transcript: "",
    overallScore: null,
    detailScores: null,
    error: null,
    isListening: false,
  };
}

export function usePronunciationRecognition({
  targetText,
  language = "en-GB",
  onResult,
}: UsePronunciationRecognitionOptions) {
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResultState>(() =>
    createInitialResult(targetText)
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const targetTextRef = useRef(targetText);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    targetTextRef.current = targetText;
  }, [targetText]);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

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

      const sttConfidence = bestAlternative.confidence;

      const analyzed = analyzeSpeech(targetTextRef.current, spokenText, sttConfidence);

      const score = analyzed.overallScore ?? 0;

      setPronunciationResult((prev) => ({
        ...prev,
        transcript: spokenText,
        overallScore: analyzed.overallScore,
        detailScores: analyzed.details as unknown as DetailScores | null,
        wordsForDisplay: analyzed.wordsForDisplay,
      }));

      const callback = onResultRef.current;

      if (callback) {
        void Promise.resolve(
          callback({
            spokenText,
            sttConfidence,
            score,
          })
        ).catch((error) => {
          console.error("Pronunciation result callback failed:", error);
        });
      }
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

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      recognition.abort();
      recognitionRef.current = null;
    };
  }, [language]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: "",
      overallScore: null,
      detailScores: null,
      error: null,
      wordsForDisplay: createNeutralWordDisplay(targetTextRef.current),
    }));

    try {
      recognition.start();
    } catch (error) {
      const errorText =
        error instanceof Error && error.name === "InvalidStateError"
          ? "Recognition state error, please try again shortly."
          : "Could not start speech recognition.";

      setPronunciationResult((prev) => ({
        ...prev,
        isListening: false,
        error: errorText,
      }));
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const resetPronunciation = useCallback(() => {
    recognitionRef.current?.abort();

    setPronunciationResult(createInitialResult(targetTextRef.current));
  }, []);

  return {
    pronunciationResult,
    startListening,
    stopListening,
    resetPronunciation,
  };
}
