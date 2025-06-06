"use client";

import { Cpu, Layers } from "lucide-react";
import { Card } from "../ui/card";
import { Level } from "@/types/lesson";

export default function UnitHeader({ data }: { data: Level }) {
  return (
    <Card className="relative overflow-hidden rounded-xl border border-gray-900/20 bg-white p-2 sm:p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] backdrop-blur-sm dark:border-white/10 dark:bg-black dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_transparent_10%,_#000_10%,_#000_10.5%,_transparent_10.5%,_transparent_20%,_#000_20%,_#000_20.5%,_transparent_20.5%)] bg-[length:20px_20px] dark:bg-[radial-gradient(circle_at_center,_transparent_10%,_#fff_10%,_#fff_10.5%,_transparent_10.5%,_transparent_20%,_#fff_20%,_#fff_20.5%,_transparent_20.5%)]"></div>
      </div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-xl opacity-20 blur-[2px]">
        <div className="h-full w-full rounded-xl border-2 border-gray-900 dark:border-white"></div>
      </div>

      {/* Diagonal line decoration */}
      <div className="absolute -right-4 -top-4 h-16 w-32 rotate-45 bg-gradient-to-r from-gray-900/0 via-gray-900/20 to-gray-900/0 dark:from-white/0 dark:via-white/20 dark:to-white/0"></div>

      <div className="relative z-10 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-gray-900 dark:text-white" />
            <h2 className={`font-mono text-xl tracking-wider text-gray-900 dark:text-white`}>
              Part {data.id} - {data.description || "The Oxford 3000 "}
            </h2>
          </div>

          {/* Futuristic decorative element */}
          <div className="flex h-6 items-center gap-1"></div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <Layers className="h-5 w-5 text-gray-600 dark:text-white/70" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm uppercase tracking-widest text-gray-600 dark:text-white/70">
              Level
            </span>
            <div className="relative">
              <p className={`font-mono text-2xl font-bold text-gray-900 dark:text-white `}>
                {data.name}
              </p>
              {/* Highlight effect */}
              <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-gray-900/0 via-gray-900 to-gray-900/0 dark:from-white/0 dark:via-white dark:to-white/0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom corner decoration */}
      <div className="absolute bottom-0 right-0 h-12 w-12 overflow-hidden">
        <div className="absolute bottom-0 right-0 h-16 w-16 translate-x-8 translate-y-8 rotate-45 border-l-2 border-t-2 border-gray-900/30 dark:border-white/30"></div>
      </div>
    </Card>
  );
}
