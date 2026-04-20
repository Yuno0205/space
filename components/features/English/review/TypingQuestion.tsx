"use client";

type TypingQuestionProps = {
  question: {
    type: "typing";
    prompt: string;
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
  typedAnswer: string;
  setTypedAnswer: (value: string) => void;
  onSubmit: () => void;
};

export function TypingQuestion({
  question,
  result,
  submitting,
  typedAnswer,
  setTypedAnswer,
  onSubmit,
}: TypingQuestionProps) {
  const canSubmit = !result && !submitting && !!typedAnswer.trim();

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100">
      <h3 className="whitespace-pre-line text-lg font-medium text-slate-900 dark:text-slate-50">
        {question.prompt}
      </h3>

      {question.meta?.sentence ? (
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-base text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          {question.meta.sentence}
        </div>
      ) : null}

      {question.meta?.audioUrl ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
          <audio controls src={question.meta.audioUrl} className="w-full" />
        </div>
      ) : null}

      <div>
        <label htmlFor="typing-answer" className="sr-only">
          Your answer
        </label>
        <input
          id="typing-answer"
          autoComplete="off"
          value={typedAnswer}
          onChange={(e) => setTypedAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (!canSubmit) return;
            e.preventDefault();
            onSubmit();
          }}
          disabled={!!result}
          placeholder="Type your answer..."
          className="w-full rounded-xl border-0 bg-slate-100 p-4 text-sm text-slate-900 shadow-none outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:opacity-60 dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {!result ? (
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {submitting ? "Saving..." : "Check answer"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
