"use client";

import { BookOpen, Check, Clock3, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Profile } from "@/types/user";

export default function DailyGoals({ profile }: { profile: Profile }) {
  const learnedMinutes = 10;
  const learnedWords = 10;

  const minutesPercent = Math.min((learnedMinutes / profile.daily_minutes_goal!) * 100, 100);

  const wordsPercent = Math.min((learnedWords / profile.daily_new_words_goal!) * 100, 100);
  return (
    <main className="flex items-center justify-center bg-background  font-sans text-foreground">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Open daily goals"
            className="rounded-md bg-card shadow-sm hover:bg-muted  border-none"
          >
            <Sparkles aria-hidden="true" className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={12}
          className="w-[min(24rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-md  border-border bg-card p-0 shadow-lg "
        >
          <div className="border-b border-border px-5 py-4">
            <PopoverHeader className="gap-1">
              <div className="flex items-center justify-between gap-4">
                <PopoverTitle className="text-base font-semibold tracking-tight">
                  Daily goals
                </PopoverTitle>
              </div>
            </PopoverHeader>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <GoalRow
              completed={minutesPercent >= 100}
              icon={<Clock3 aria-hidden="true" />}
              title="Study time"
              value={`${profile.daily_minutes_goal} min / day`}
              progress={`${learnedMinutes} min completed`}
              percent={Math.round(minutesPercent)}
            />

            <GoalRow
              completed={wordsPercent >= 100}
              icon={<BookOpen aria-hidden="true" />}
              title="New words"
              value={`${profile.daily_new_words_goal} words / day`}
              progress={`${learnedWords} words learned`}
              percent={Math.round(wordsPercent)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </main>
  );
}

function GoalRow({
  completed = false,
  icon,
  title,
  value,
  progress,
  percent,
}: {
  completed?: boolean;
  icon: React.ReactNode;
  title: string;
  value: string;
  progress: string;
  percent: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-4">
            {icon}
          </span>
          <span className="truncate text-sm font-medium">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {completed && (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Check aria-hidden="true" className="size-3.5" />
              Done
            </span>
          )}
          <span className="text-xs font-semibold">{value}</span>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={`${title} progress`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress}</span>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
