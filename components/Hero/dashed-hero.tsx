"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { ReactTyped } from "react-typed";
import { Orbitron } from "next/font/google";
import "./style.scss";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface DashedHeroProps {
  title: ReactNode;
  description: ReactNode;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  commandText?: string;
}

type TechStackType = Record<string, string>;

const TechStack: TechStackType[] = [
  { "Next.js": "text-white" }, // Màu trắng cho Next.js
  { React: "text-[#61DAFB]" }, // Màu xanh đặc trưng cho React
  { "Tailwind CSS": "text-sky-400" }, // Màu xanh dương sáng cho Tailwind CSS
  { TypeScript: "text-[#3178C6]" }, // Màu xanh lam đậm cho TypeScript
  { Supabase: "text-[#3ECF8E]" }, // Màu xanh lá cây cho Supabase
  { WordPress: "text-[#21759B]" }, // Màu xanh nước biển cho WordPress
  { "Framer Motion": "text-[#0055FF]" }, // Màu xanh dương cho Framer Motion
];

export function DashedHero({
  title,
  description,
  primaryButtonText = "Get Started",
  primaryButtonHref = "#",
  secondaryButtonText,
  secondaryButtonHref,
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
              className={`text-4xl md:text-5xl font-bold text-white mb-6 ${orbitron.className}`}
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
              <span className={cn("text-white font-bold text-3xl ", orbitron.className)}>
                Space
              </span>

              <div className="inline-block my-5 py-2">
                {" "}
                - Developed with{" "}
                <span>
                  <ReactTyped
                    strings={TechStack.map((tech) => {
                      const techName = Object.keys(tech)[0];
                      const techClass = tech[techName];

                      // Tạo phần tử span với CSS class tương ứng cho mỗi từ
                      return `<span class='${techClass} text-3xl font-semibold'>${techName}</span>`;
                    })}
                    typeSpeed={100}
                    backSpeed={50}
                    backDelay={1000}
                    startDelay={500}
                    loop
                    className="orbitron-classname" // Thêm font tùy chọn của bạn ở đây
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
          </div>
        </div>
      </div>
    </div>
  );
}
