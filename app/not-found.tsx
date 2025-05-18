// app/not-found.tsx
import NotFoundClient from "@/components/Fallback/not-found-animation";
import { cn } from "@/lib/utils";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: "400" });

// Dynamic import client component, SSR disabled

export default function NotFoundPage() {
  return (
    <div className={cn("h-full w-full", orbitron.className)}>
      <NotFoundClient />
    </div>
  );
}
