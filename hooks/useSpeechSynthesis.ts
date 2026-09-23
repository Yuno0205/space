import { useState, useEffect, useCallback, useRef } from "react";

interface PlayAudioOptions {
  audioUrl?: string | null;
  text: string;
  timeoutMs?: number;
  lang?: string; // defaults to "en-US", can be omitted if only English is used
}

export const useSpeechSynthesis = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the browser's available voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);

      // Full cleanup on unmount: cancel TTS, clear pending timeout, stop URL audio
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speak the text via TTS (used internally, or when audioUrl is missing/fails)
  const speakText = useCallback(
    (text: string, lang = "en-US") => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setIsPlaying(false);
        return;
      }

      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const selectedVoice =
        voices.find((v) => v.lang === lang) ||
        voices.find((v) => v.lang.startsWith(lang.split("-")[0]));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        utterance.lang = lang;
      }

      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = (event) => {
        console.warn(`Speech error: ${event.error}`);
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
    },
    [voices]
  );

  // Stop any audio/TTS currently playing
  const stopAudio = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  // Main API: play audio if available; fall back to TTS on error/timeout or if no audioUrl
  const playAudio = useCallback(
    ({ audioUrl, text, timeoutMs = 3000, lang }: PlayAudioOptions) => {
      stopAudio();
      setIsPlaying(true); // set immediately to prevent spamming from the start

      const trimmedUrl = audioUrl?.trim();
      if (!trimmedUrl) {
        speakText(text, lang);
        return;
      }

      const audio = new Audio(trimmedUrl);
      audioRef.current = audio;
      audio.addEventListener("ended", () => setIsPlaying(false));

      // Handle errors that occur AFTER playback has already started
      audio.addEventListener(
        "error",
        () => {
          if (audioRef.current !== audio) return; // a newer playback has taken over, ignore
          console.warn("Audio playback error after start, fallback to TTS");
          audio.src = "";
          audioRef.current = null;
          speakText(text, lang);
        },
        { once: true }
      );

      const playPromise = audio.play();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => reject(new Error("Audio load timeout")), timeoutMs);
      });

      Promise.race([playPromise, timeoutPromise])
        .then(() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        })
        .catch((err) => {
          console.warn("Audio failed or timed out, fallback to TTS:", err);
          audio.pause();
          audio.src = "";
          if (audioRef.current === audio) audioRef.current = null;
          speakText(text, lang);
        });
    },
    [speakText, stopAudio]
  );

  return { playAudio, stopAudio, isPlaying };
};
