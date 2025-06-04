// LevelNode.tsx
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

interface LevelNodeProps {
  left: number;
  label?: string;
}

export function LevelNode({ left, label }: LevelNodeProps) {
  return (
    <div className="relative flex mt-4 item" style={{ left: `${left}px` }}>
      <div className="inline-flex cursor-pointer">
        {/* Vòng tròn progress */}
        <ProgressRing progress={0.5} />

        <div className="m-4 relative">
          <button className="node">
            {/* Hiển thị nhãn bên trong button nếu có */}
            <span className={cn(orbitron.className, "font-bold text-2xl")}>{label ?? ""}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
