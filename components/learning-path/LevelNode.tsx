"use client";
import { cn } from "@/lib/utils";
import "./styles/style.scss";
import { Orbitron } from "next/font/google";

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
        <svg viewBox="0 0 100 100" className="progress-ring">
          <defs>
            <clipPath id="clip-session/ProgressRing3857">
              <path d="M3.061616997868383e-15,-50L2.5717582782094417e-15,-42Z"></path>
            </clipPath>
          </defs>
          <g transform="translate(50, 50)">
            <path
              d="M3.061616997868383e-15,-50A50,50,0,1,1,-3.061616997868383e-15,50A50,50,0,1,1,3.061616997868383e-15,-50M-7.715274834628325e-15,-42A42,42,0,1,0,7.715274834628325e-15,42A42,42,0,1,0,-7.715274834628325e-15,-42Z"
              fill="rgb(var(--color-swan))"
            ></path>
            <circle
              clipPath="url(#clip-session/ProgressRing3857)"
              cx="-3.9949609477190866"
              cy="-45.82619651494328"
              fill="rgb(var(--color-snow))"
              r="4"
            ></circle>
            <path
              d="M3.061616997868383e-15,-50L2.5717582782094417e-15,-42Z"
              fill="var(--path-unit-character-color)"
            ></path>
          </g>
        </svg>

        <div className="m-4 relative inline-flex backface-hidden">
          <button className="node">
            <span className={cn(orbitron.className, "font-bold text-2xl")}>A</span>
          </button>
        </div>
      </div>
    </div>
  );
}
