"use client";

import { Level } from "@/types/lesson";
import { Orbitron } from "next/font/google";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-orbitron",
});

export default function UnitHeader({ data }: { data: Level }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative my-16 w-full max-w-6xl mx-auto py-10 px-8"
    >
      {/* Decorative lines and grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-white/20 via-white/50 to-white/20"></div>
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-white/20 via-white/50 to-white/20"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left side: Log Entry Info */}
        <div className="md:col-span-1 text-left">
          <motion.div variants={itemVariants}>
            <p className="font-mono text-sm uppercase tracking-widest text-white/50">LOG ENTRY</p>
            <p className="text-4xl font-bold text-white">0{data.id}</p>
          </motion.div>
        </div>

        {/* Right side: Destination Details */}
        <div className="md:col-span-3 border-l-2 border-white/20 pl-8">
          <motion.div variants={itemVariants}>
            <p className="font-mono text-sm uppercase tracking-widest text-white/50">
              DESTINATION REACHED:
            </p>
            <h1
              className={cn("text-7xl md:text-8xl font-black text-white mt-2", orbitron.className)}
            >
              SECTOR {data.name}
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6">
            <p className="font-mono text-sm uppercase tracking-widest text-white/50">ANALYSIS:</p>
            <p className="mt-2 text-lg text-white/80 max-w-md">
              {data.description || "The Oxford 3000 core vocabulary."}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
