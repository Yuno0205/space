"use client";

import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { ReactTyped } from "react-typed";
import { Orbitron } from "next/font/google";
import "./style.scss";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface DashedHeroProps {
  title: ReactNode;
  description: ReactNode;
  user: SupabaseUser | null;
}

type TechStackType = Record<string, string>;

const TechStack: TechStackType[] = [
  { "Next.js": "text-white" },
  { React: "text-[#61DAFB]" },
  { "Tailwind CSS": "text-sky-400" },
  { TypeScript: "text-[#3178C6]" },
  { Supabase: "text-[#3ECF8E]" },
  { WordPress: "text-[#21759B]" },
  { "Framer Motion": "text-[#0055FF]" },
];

export function DashedHero({ title, description, user }: DashedHeroProps) {
  const supabase = useMemo(() => createClient(), []);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const appOrigin = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (fromEnv) return new URL(fromEnv).origin;
    return window.location.origin;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appOrigin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="relative w-full py-24 px-4">
      {/* Dashed border container */}
      <div className="relative mx-auto max-w-6xl">
        {/* Corner decorations */}
        <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full border border-dashed border-white/30"></div>
        <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full border border-dashed border-white/30"></div>
        <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full border border-dashed border-white/30"></div>
        <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full border border-dashed border-white/30"></div>

        {/* Horizontal dashed lines */}
        <div className="absolute top-0 left-3 right-3 h-px border-t border-dashed border-white/30"></div>
        <div className="absolute bottom-0 left-3 right-3 h-px border-t border-dashed border-white/30"></div>

        {/* Vertical dashed lines */}
        <div className="absolute top-3 bottom-3 left-0 w-px border-l border-dashed border-white/30"></div>
        <div className="absolute top-3 bottom-3 right-0 w-px border-l border-dashed border-white/30"></div>

        <div className="px-8 py-20 md:px-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-4xl md:text-5xl font-bold dark:text-white light:text-black mb-6 ${orbitron.className}`}
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-3xl mb-16"
            >
              <span
                className={cn(
                  "text-black dark:text-white font-bold text-3xl pr-2",
                  orbitron.className
                )}
              >
                Space
              </span>

              <div className="inline-block my-5 py-2 writer">
                - Developed with{" "}
                <span>
                  <ReactTyped
                    strings={TechStack.map((tech) => {
                      const techName = Object.keys(tech)[0];
                      const techClass = tech[techName];

                      // Create span element with corresponding CSS class for each tech stack
                      return `<span class='${techClass} text-3xl font-semibold inline'>${techName}</span>`;
                    })}
                    typeSpeed={100}
                    backSpeed={50}
                    backDelay={1000}
                    startDelay={500}
                    loop
                  />
                </span>
              </div>

              <br />

              <span className="mt-5">{description}</span>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              {user ? (
                <Button
                  variant={"outline"}
                  className="mx-4 flex h-12 w-full items-center justify-center gap-3 rounded-xl border-border bg-background px-6 text-md font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:translate-y-0"
                >
                  <Link href="/dashboard">Go to Dashboard?</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mx-4 flex h-12 w-full items-center justify-center gap-3 rounded-xl border-border bg-background px-6 text-md font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:translate-y-0"
                  onClick={signInWithGoogle}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      {/* Google icon */}
                      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M21.35 12.23c0-.68-.06-1.36-.18-2H12v3.79h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.18Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 21.64c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.64Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.53 13.72a5.85 5.85 0 0 1 0-3.44V7.75H3.29a9.77 9.77 0 0 0 0 8.5l3.24-2.53Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 6.25c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.3 14.63 2.36 12 2.36a9.74 9.74 0 0 0-8.71 5.39l3.24 2.53C7.3 7.97 9.46 6.25 12 6.25Z"
                        />
                      </svg>

                      <span>Kick-start your journey with Google</span>
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
