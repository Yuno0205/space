"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { Typewriter } from "react-simple-typewriter";

interface DashedHeroProps {
  title: ReactNode;
  description: ReactNode;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  commandText?: string;
}

export function DashedHero({
  title,
  description,
  primaryButtonText = "Get Started",
  primaryButtonHref = "#",
  secondaryButtonText,
  secondaryButtonHref,
  commandText,
}: DashedHeroProps) {
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-12"
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
              {description}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              <Link
                href={primaryButtonHref}
                className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-black transition-colors hover:bg-gray-200"
              >
                {primaryButtonText}
              </Link>

              {secondaryButtonText && (
                <Link
                  href={secondaryButtonHref || "#"}
                  className="inline-flex items-center justify-center rounded-md border border-white/20 bg-transparent px-8 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </motion.div>

            {/* Typewriter */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-mono text-sm text-gray-500"
            >
              <Typewriter
                words={["Developer.", "Blogger.", "Language Learner."]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
