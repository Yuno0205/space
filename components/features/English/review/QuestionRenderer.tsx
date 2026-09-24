"use client";

import { McqQuestion } from "./questions/McqQuestion";
import { SpeakingQuestion } from "./questions/SpeakingQuestion";
import { TypingQuestion } from "./questions/TypingQuestion";
import { ReviewResult, ReviewSubmission, TQuestion } from "./types";

type QuestionRendererProps = {
  question: TQuestion;
  result: ReviewResult;
  submitting: boolean;
  selectedOption: string | null;
  typedAnswer: string;
  setSelectedOption: (value: string | null) => void;
  setTypedAnswer: (value: string) => void;
  onSubmit: (submission?: ReviewSubmission) => Promise<boolean>;
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
      return <SpeakingQuestion question={question} submitting={submitting} onSubmit={onSubmit} />;

    default:
      return null;
  }
}
