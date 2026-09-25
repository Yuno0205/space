"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeToken } from "@/utils";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

type McqQuestionProps = {
  question: {
    type: "mcq";
    prompt: string;
    options: string[];
    correctAnswer: string;
    meta?: {
      audioUrl?: string | null;
      sentence?: string | null;
    };
  };
  result: {
    isCorrect: boolean;
    correctAnswer: string;
  } | null;
  submitting: boolean;
  selectedOption: string | null;
  setSelectedOption: (value: string | null) => void;
  onSubmit: () => void;
};

export function McqQuestion({
  question,
  result,
  submitting,
  selectedOption,
  setSelectedOption,
  onSubmit,
}: McqQuestionProps) {
  return (
    <div className="space-y-6 bg-white p-2 text-black sm:p-4 dark:bg-transparent dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-white shadow-2xl dark:bg-black"
      >
        <Card className="border-gray-300 bg-white dark:border-gray-700 dark:bg-white/5">
          <CardHeader className="border-b border-gray-300 dark:border-gray-700">
            <CardTitle>Multiple Choice</CardTitle>
            <CardDescription className="whitespace-pre-line text-gray-600 dark:text-gray-300">
              {question.prompt}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            {question.meta?.sentence ? (
              <div className="rounded-xl border border-gray-300 bg-gray-100 p-4 text-base text-gray-800 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-100">
                {question.meta.sentence}
              </div>
            ) : null}

            {question.meta?.audioUrl ? (
              <div className="rounded-xl border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/20">
                <audio controls src={question.meta.audioUrl} className="w-full" />
              </div>
            ) : null}

            <div className="grid gap-3.5">
              {question.options.map((option) => {
                const isSelected = selectedOption === option;
                const showCorrect =
                  !!result && normalizeToken(option) === normalizeToken(question.correctAnswer);
                const showWrong =
                  !!result &&
                  isSelected &&
                  normalizeToken(option) !== normalizeToken(question.correctAnswer);

                const optionVisual = showCorrect
                  ? "border-green-500 bg-green-50 font-semibold text-green-900 dark:border-green-600 dark:bg-green-950/20 dark:text-green-100"
                  : showWrong
                    ? "border-red-500 bg-red-50 font-semibold text-red-900 dark:border-red-600 dark:bg-red-950/20 dark:text-red-100"
                    : isSelected
                      ? "border-gray-700 bg-gray-900 text-white dark:border-gray-300 dark:bg-white dark:text-black"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100 dark:hover:bg-gray-800/60";

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={!!result}
                    onClick={() => setSelectedOption(option)}
                    className={[
                      "flex items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-sm transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/40",
                      optionVisual,
                    ].join(" ")}
                  >
                    <span>{option}</span>
                    {showCorrect ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
                    ) : showWrong ? (
                      <XCircle className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 opacity-40" />
                    )}
                  </button>
                );
              })}
            </div>

            {!result ? (
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={submitting || !selectedOption}
                  className="h-11 rounded-xl bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {submitting ? "Saving..." : "Check answer"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>

      {!result && submitting ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Saving answer...</p>
      ) : null}
    </div>
  );
}
