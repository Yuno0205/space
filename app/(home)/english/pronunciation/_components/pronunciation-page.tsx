"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { GroupedPhonemes } from "@/types/pronunciation";
import { PhonemeSection } from "./phoneme-section";

interface PronunciationPageProps {
  phonemes: GroupedPhonemes;
}

export default function PronunciationPage({ phonemes }: PronunciationPageProps) {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <FadeIn>
        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Phonetic Training Ground
          </h1>

          <p className="max-w-2xl text-muted-foreground">
            Calibrate your vocal output by mastering the 44 fundamental components of the English
            language.
          </p>
        </header>
      </FadeIn>

      <div className="space-y-12">
        <PhonemeSection title="Monophthongs" data={phonemes.monophthongs} />

        <PhonemeSection title="Diphthongs" data={phonemes.diphthongs} />

        <PhonemeSection title="Consonants" data={phonemes.consonants} />
      </div>
    </div>
  );
}
