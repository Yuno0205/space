"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2 } from "lucide-react";
import Link from "next/link";
import type React from "react";

// Bổ sung progress và audioUrl vào dữ liệu mẫu
const vowels = [
  { ipa: "iː", example: "sheep", progress: 80, audioUrl: "/audio/phonemes/iː.mp3" },
  { ipa: "ɪ", example: "ship", progress: 65, audioUrl: "/audio/phonemes/ɪ.mp3" },
  { ipa: "e", example: "bed", progress: 40, audioUrl: "/audio/phonemes/e.mp3" },
  { ipa: "æ", example: "cat", progress: 0, audioUrl: "/audio/phonemes/æ.mp3" },
  // ... thêm các nguyên âm khác
];

const consonants = [
  { ipa: "p", example: "pen", progress: 95, audioUrl: "/audio/phonemes/p.mp3" },
  { ipa: "b", example: "bad", progress: 88, audioUrl: "/audio/phonemes/b.mp3" },
  { ipa: "t", example: "tea", progress: 70, audioUrl: "/audio/phonemes/t.mp3" },
  { ipa: "d", example: "did", progress: 10, audioUrl: "/audio/phonemes/d.mp3" },
  // ... thêm các phụ âm khác
];

// Component PhonemeCard đã được nâng cấp
const PhonemeCard = ({
  ipa,
  example,
  progress,
  audioUrl,
}: {
  ipa: string;
  example: string;
  progress: number;
  audioUrl: string;
}) => {
  const handlePlaySound = (e: React.MouseEvent) => {
    // Ngăn sự kiện click lan ra component Link bên ngoài, tránh chuyển trang
    e.stopPropagation();
    e.preventDefault();

    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  return (
    <Link
      href={`/english/speaking/phoneme/${encodeURIComponent(ipa)}`}
      className="group relative flex flex-col w-32 rounded-lg border border-border bg-card/50 transition-all duration-300 hover:bg-accent hover:border-primary/50 hover:-translate-y-1"
    >
      <div className="flex-grow p-4 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{ipa}</span>
        <span className="text-sm text-muted-foreground mt-1">{example}</span>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">{progress}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={handlePlaySound}
            aria-label={`Play sound for ${ipa}`}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </Link>
  );
};

export default function SpeakingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-2">Speaking Practice</h1>
        <p className="text-muted-foreground mb-8">
          Master English pronunciation by practicing each sound individually.
        </p>
      </FadeIn>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Vowels (Nguyên âm)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {vowels.map((v) => (
              <PhonemeCard
                key={v.ipa}
                ipa={v.ipa}
                example={v.example}
                progress={v.progress}
                audioUrl={v.audioUrl}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consonants (Phụ âm)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {consonants.map((c) => (
              <PhonemeCard
                key={c.ipa}
                ipa={c.ipa}
                example={c.example}
                progress={c.progress}
                audioUrl={c.audioUrl}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
