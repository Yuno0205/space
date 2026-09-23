"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Phoneme } from "@/types/pronunciation";
import { Volume2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PhonemeCardProps {
  phoneme: Phoneme;
}

export function PhonemeCard({ phoneme }: PhonemeCardProps) {
  const progress = phoneme.progress ?? 0;

  const handlePlaySound = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const audio = new Audio(`/assets/audio/ipa/${phoneme.symbol}_uk.mp3`);

    audio.play().catch((error) => {
      console.error("Audio play failed:", error);
    });
  };

  return (
    <div className="group relative min-w-32">
      <Link
        href={`/english/pronunciation/${phoneme.id}`}
        className="
          flex flex-col
          rounded-lg
          border border-primary/20
          bg-card/40
          backdrop-blur-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-primary/60
          hover:bg-accent
          hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]
        "
      >
        <div className="flex flex-grow flex-col items-center justify-center p-4">
          <span className="text-4xl font-bold text-foreground drop-shadow-sm">
            {phoneme.symbol}
          </span>

          <span className="mt-1 text-xs uppercase tracking-tighter text-muted-foreground">
            {phoneme.example_word || "mission"}
          </span>
        </div>

        <div className="px-3 pb-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">{progress}%</span>

            {/* Keep spacing consistent with audio button */}
            <div className="h-6 w-6" />
          </div>

          <Progress value={progress} className="h-1 bg-primary/10" />
        </div>
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Play ${phoneme.symbol} audio`}
        className="
          absolute right-3 top-3 z-10
          h-6 w-6
          rounded-full
          hover:bg-primary/20
        "
        onClick={handlePlaySound}
      >
        <Volume2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
