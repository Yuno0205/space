"use client";
import { cn } from "@/lib/utils";
import "./styles/style.scss";
import { Orbitron } from "next/font/google";
import ProgressRing from "./ProgressRing";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-orbitron",
});

export function LevelNode() {
  return (
    <div className="relative flex mt-10 left-0">
      <div className="inline-flex cursor-pointer">
        {/* Rounded ring */}
        <ProgressRing progress={0.5} />

        <div className="m-4 relative inline-flex backface-hidden">
          <button className="node">
            <span className={cn(orbitron.className, "font-bold text-2xl")}>A</span>
          </button>
        </div>
      </div>
    </div>
  );
}
