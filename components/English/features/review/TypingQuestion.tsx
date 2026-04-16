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
  return (
    <>
      <h3 className="whitespace-pre-line text-lg font-medium text-slate-50">{question.prompt}</h3>

      {question.meta?.sentence ? (
        <div className="mt-4 rounded-xl bg-slate-900 p-4 text-base text-slate-100">
          {question.meta.sentence}
        </div>
      ) : null}

      {question.meta?.audioUrl ? (
        <div className="mt-4">
          <audio controls src={question.meta.audioUrl} className="w-full" />
        </div>
      ) : null}

      <div className="mt-6">
        <input
          value={typedAnswer}
          onChange={(e) => setTypedAnswer(e.target.value)}
          disabled={!!result}
          placeholder="Type your answer..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-100"
        />
      </div>

      {!result ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !typedAnswer.trim()}
            className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-white disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Check answer"}
          </button>
        </div>
      ) : null}
    </>
  );
}
