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

/**
 * COMPONENT: Individual Phoneme Card
 */
const PhonemeCard = ({ phoneme }: { phoneme: Phoneme }) => {
  const progress = phoneme.progress || 0;

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = new Audio(`/assets/audio/ipa/${phoneme.symbol}_uk.mp3`);
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  return (
    <Link
      href={`/english/speaking/${phoneme.id}`}
      className="group relative flex flex-col w-32 rounded-lg border border-primary/20 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]"
    >
      <div className="flex-grow p-4 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground drop-shadow-sm">{phoneme.symbol}</span>
        <span className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">
          {phoneme.description || "mission"}
        </span>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">{progress}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-primary/20"
            onClick={handlePlaySound}
          >
            <Volume2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Progress value={progress} className="h-1 bg-primary/10" />
      </div>
    </Link>
  );
};

/**
 * MAIN PAGE: Speaking System Dashboard
 */
export default function SpeakingPage() {
  const [phonemes, setPhonemes] = useState<GroupedPhonemes>({
    monophthongs: [],
    diphthongs: [],
    consonants: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAndGroupPhonemes();
  }, []);

  /**
   * Fetch phonemes from Supabase and group them by type
   */
  async function fetchAndGroupPhonemes() {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-primary font-mono">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <span className="animate-pulse">INITIALIZING_PHONETIC_DATABASE...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 bg-black min-h-screen">
      <FadeIn>
        <header className="mb-12 border-l-4 border-primary pl-6">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 italic">
            Phonetic Training Ground
          </h1>
          <p className="text-muted-foreground max-w-2xl font-light">
            Calibrate your vocal output by mastering the 44 fundamental components of the English
            language.
          </p>
        </header>
      </FadeIn>

      <div className="space-y-16">
        {/* SECTION 01: MONOPHTHONGS */}
        <PhonemeSection
          title="Monophthongs"
          subtitle="Single Vowel Core Frequencies"
          data={phonemes.monophthongs}
        />

        {/* SECTION 02: DIPHTHONGS */}
        <PhonemeSection
          title="Diphthongs"
          subtitle="Dual Vowel Hybrid Signals"
          data={phonemes.diphthongs}
        />

        {/* SECTION 03: CONSONANTS */}
        <PhonemeSection
          title="Consonants"
          subtitle="Pulse Waves & Fricatives"
          data={phonemes.consonants}
        />
      </div>
    </div>
  );
}

/**
 * HELPER: Section Wrapper
 */
function PhonemeSection({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Phoneme[];
}) {
  if (data.length === 0) return null;

  return (
    <section>
      <div className="flex items-end gap-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight uppercase">{title}</h2>
        <span className="text-xs text-primary/60 font-mono mb-1 tracking-widest">{subtitle}</span>
      </div>
      <div className="flex flex-wrap gap-5">
        {data.map((p) => (
          <PhonemeCard key={p.symbol} phoneme={p} />
        ))}
      </div>
    </section>
  );
}
