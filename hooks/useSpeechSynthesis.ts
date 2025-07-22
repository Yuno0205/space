import { useState, useEffect, useCallback } from "react";

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        console.warn("SpeechSynthesis API is not supported.");
        onEnd?.();
        return null;
      }

      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      const selectedVoice =
        voices.find((voice) => voice.lang === "en-US") ||
        voices.find((voice) => voice.lang.startsWith("en-"));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        utterance.lang = "en-US";
      }

      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        console.warn(`Speech error: ${event.error}`);
        setIsSpeaking(false);
        onEnd?.();
      };

      speechSynthesis.speak(utterance);
      return utterance;
    },
    [voices]
  );

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, cancel, isSpeaking };
};
