"use client";

import { ReviewResult, TQuestion } from ".";
import { McqQuestion } from "./McqQuestion";
import { SpeakingQuestion } from "./SpeakingQuestion";
import { TypingQuestion } from "./TypingQuestion";

type QuestionRendererProps = {
  question: TQuestion;
  result: ReviewResult;
  setResult: (data: ReviewResult) => void;
  submitting: boolean;
  selectedOption: string | null;
  typedAnswer: string;
  setSelectedOption: (value: string | null) => void;
  setTypedAnswer: (value: string) => void;
  onSubmit: () => void;
};

export function QuestionRenderer({
  question,
  result,
  submitting,
  selectedOption,
  typedAnswer,
  setSelectedOption,
  setTypedAnswer,
  onSubmit,
  setResult,
}: QuestionRendererProps) {
  switch (question.type) {
    case "mcq":
      return (
        <McqQuestion
          question={question}
          result={result}
          submitting={submitting}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onSubmit={onSubmit}
        />
      );

    case "typing":
      return (
        <TypingQuestion
          question={question}
          result={result}
          submitting={submitting}
          typedAnswer={typedAnswer}
          setTypedAnswer={setTypedAnswer}
          onSubmit={onSubmit}
        />
      );

    case "speaking":
      return (
        <SpeakingQuestion
          question={question}
          setResult={setResult as (a: unknown) => void}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      );

    default:
      return null;
  }
}
