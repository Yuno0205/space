"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase/public";
import { Loader2, Volume2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

/**
 * TYPES DEFINITIONS
 */
interface Phoneme {
  id: number;
  symbol: string;
  type: "vowel" | "diphthong" | "consonant";
  description: string;
  progress?: number; // Calculated later based on user activity
}

interface GroupedPhonemes {
  monophthongs: Phoneme[];
  diphthongs: Phoneme[];
  consonants: Phoneme[];
}

const PhonemeCard = ({ phoneme }: { phoneme: Phoneme }) => {
  const progress = phoneme.progress || 0;

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = new Audio(`/assets/audio/ipa/${phoneme.symbol}_uk.mp3`);
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  return (
    <div className="relative group min-w-32">
      {/* The navigable card */}
      <Link
        href={`/english/speaking/${phoneme.id}`}
        className="flex flex-col rounded-lg border border-primary/20 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]"
      >
        <div className="flex-grow p-4 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground drop-shadow-sm">
            {phoneme.symbol}
          </span>
          <span className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">
            {phoneme.description || "mission"}
          </span>
        </div>
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">{progress}%</span>
            {/* Spacer to keep layout consistent */}
            <div className="h-6 w-6" />
          </div>
          <Progress value={progress} className="h-1 bg-primary/10" />
        </div>
      </Link>

      {/* Audio button  */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Play ${phoneme.symbol} audio`}
        className="absolute top-3 right-3 h-6 w-6 rounded-full hover:bg-primary/20 z-10"
        onClick={handlePlaySound}
      >
        <Volume2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

//MAIN PAGE: Speaking System Dashboard

export default function SpeakingPage() {
  const [phonemes, setPhonemes] = useState<GroupedPhonemes>({
    monophthongs: [],
    diphthongs: [],
    consonants: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAndGroupPhonemes();
  }, []);

  //Fetch phonemes from Supabase and group them by type

  async function fetchAndGroupPhonemes() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("phonemes")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data) {
        const grouped = data.reduce(
          (acc: GroupedPhonemes, item: Phoneme) => {
            if (item.type === "vowel") acc.monophthongs.push(item);
            else if (item.type === "diphthong") acc.diphthongs.push(item);
            else if (item.type === "consonant") acc.consonants.push(item);
            return acc;
          },
          { monophthongs: [], diphthongs: [], consonants: [] }
        );
        setPhonemes(grouped);
      }
    } catch (err) {
      console.error("System Error: Failed to initialize phoneme data", err);
      setError("Failed to initialize phoneme data");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-12">
        <p className="text-sm text-destructive">{error}</p>
        <Button onClick={fetchAndGroupPhonemes}>Retry</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground animate-pulse">
          Initializing phonetic database...
        </span>
      </div>
    );
  }

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
        {/* SECTION 01: MONOPHTHONGS */}
        <PhonemeSection title="Monophthongs" data={phonemes.monophthongs} />

        {/* SECTION 02: DIPHTHONGS */}
        <PhonemeSection title="Diphthongs" data={phonemes.diphthongs} />

        {/* SECTION 03: CONSONANTS */}
        <PhonemeSection title="Consonants" data={phonemes.consonants} />
      </div>
    </div>
  );
}

//HELPER: Section Wrapper

function PhonemeSection({
  title,

  data,
}: {
  title: string;

  data: Phoneme[];
}) {
  if (data.length === 0) return null;

  return (
    <section>
      <div className="flex items-end gap-4 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.map((p) => (
          <PhonemeCard key={p.symbol} phoneme={p} />
        ))}
      </div>
    </section>
  );
}
