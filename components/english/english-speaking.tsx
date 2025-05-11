"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VocabularyCard } from "@/types/vocabulary";
import { ArrowRight, Check, Mic, Volume2, X } from "lucide-react";
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// Dữ liệu mẫu từ code gốc của bạn
export const exampleCards = [
  {
    id: "1",
    word: "ephemeral",
    phonetic: "/ɪˈfɛm(ə)rəl/",
    audio_url: "https://example.com/audio/ephemeral.mp3",
    word_type: "adjective",
    definition: "Lasting for a very short time.",
    translation: "Ngắn ngủi, thoáng qua",
    example: "The ephemeral nature of fashion trends makes it hard to keep up.",
  },
  {
    id: "2",
    word: "serendipity",
    phonetic: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    audio_url: "https://example.com/audio/serendipity.mp3",
    word_type: "noun",
    definition: "The occurrence and development of events by chance in a happy or beneficial way.",
    translation: "Tình cờ may mắn",
    example: "The discovery of penicillin was a serendipity.",
  },
  {
    id: "3",
    word: "ubiquitous",
    phonetic: "/juːˈbɪk.wɪ.təs/",
    audio_url: "https://example.com/audio/ubiquitous.mp3",
    word_type: "adjective",
    definition: "Present, appearing, or found everywhere.",
    translation: "Phổ biến, có mặt khắp nơi",
    example: "Mobile phones are now ubiquitous in modern society.",
  },
];

export default function SpeakingPractice() {
  // Lấy luôn dữ liệu giả
  const [cards] = useState<VocabularyCard[]>(exampleCards);
  const [index, setIndex] = useState<number>(0);
  const currentCard = cards[index];

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");
  const [score, setScore] = useState(0);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Trình duyệt không hỗ trợ SpeechRecognition.</p>;
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1)
      .fill(0)
      .map(() => Array(str1.length + 1).fill(0));
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    const distance = track[str2.length][str1.length];
    return distance ? 1 - distance / Math.max(str1.length, str2.length) : 1;
  };

  const onToggleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      // Tính score rồi feedback
      const spoken = transcript.toLowerCase();
      const target = currentCard.word.toLowerCase();
      const sim = calculateSimilarity(spoken, target);
      const confScore = Math.round(sim * 100);
      setScore(confScore);
      setFeedback(confScore > 70 ? "correct" : "incorrect");
    } else {
      resetTranscript();
      setFeedback("");
      setScore(0);
      try {
        SpeechRecognition.startListening({
          language: "en-US",
          continuous: false,
        });
      } catch (error) {
        console.log("Error starting speech recognition:", error);
      }
    }
  };

  const nextCard = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      resetTranscript();
      setFeedback("");
      setScore(0);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>#{index + 1} Luyện nói</CardTitle>
          <CardDescription>Nhấn 🎤 và đọc từ</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{currentCard.word}</h2>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-500">{currentCard.phonetic}</p>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => {
                if (currentCard.audio_url) {
                  const audio = new Audio(currentCard.audio_url);
                  audio.play().catch((err) => {
                    console.error("Audio playback error:", err);
                    if ("speechSynthesis" in window) {
                      const utterance = new SpeechSynthesisUtterance(currentCard.word);
                      utterance.lang = "en-US";
                      window.speechSynthesis.speak(utterance);
                    }
                  });
                } else if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(currentCard.word);
                  utterance.lang = "en-US";
                  window.speechSynthesis.speak(utterance);
                }
              }}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
          <Button
            size="lg"
            className={cn("rounded-full h-16 w-16", listening ? "bg-red-500" : "bg-primary")}
            onClick={onToggleListen}
          >
            <Mic className="h-6 w-6" />
          </Button>

          {transcript && (
            <div className="space-y-2">
              <p>
                Bạn nói: <em>{transcript}</em>
              </p>
              <div className="flex items-center justify-center space-x-2">
                {feedback === "correct" ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )}
                <span>{score}%</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="flex-1"
            onClick={nextCard}
            disabled={index >= cards.length - 1}
          >
            Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
