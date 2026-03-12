// components/English/features/multiple-choice-review.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useState } from "react";

// Dữ liệu mẫu cho câu hỏi và các lựa chọn
interface MCQProps {
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  onAnswer: (isCorrect: boolean) => void;
}

export const MultipleChoiceReview: React.FC<MCQProps> = ({
  question,
  options,
  correctAnswerId,
  onAnswer,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedId(optionId);
    setIsSubmitted(true);
    onAnswer(optionId === correctAnswerId);
  };

  const getOptionState = (optionId: string) => {
    if (!isSubmitted) return "default";
    if (optionId === correctAnswerId) return "correct";
    if (optionId === selectedId) return "incorrect";
    return "default";
  };

  const optionVariants = {
    default: "border-border hover:bg-accent",
    correct: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300",
    incorrect: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300",
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center font-medium leading-relaxed">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: isSubmitted ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
          >
            <Button
              variant="outline"
              className={cn(
                "w-full h-auto justify-start p-4 text-left whitespace-normal transition-all duration-300",
                optionVariants[getOptionState(option.id)]
              )}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitted}
            >
              <div className="flex items-center w-full">
                <span className="flex-1">{option.text}</span>
                {isSubmitted && getOptionState(option.id) === "correct" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isSubmitted && getOptionState(option.id) === "incorrect" && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceReview;
