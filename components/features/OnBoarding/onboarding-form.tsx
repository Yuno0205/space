"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const levels = [
  { value: "beginner", title: "Beginner", description: "I am just starting to learn English" },
  { value: "intermediate", title: "Intermediate", description: "I can handle basic conversations" },
  { value: "advanced", title: "Advanced", description: "I want to build advanced confidence" },
];

const dailyWords = [
  { value: "5", title: "5 words", description: "A gentle, easy-to-maintain pace" },
  { value: "10", title: "10 words", description: "Steady progress every day" },
  { value: "20", title: "20 words", description: "Build your vocabulary faster" },
  { value: "30", title: "30 words", description: "Reach an ambitious daily goal" },
];

const dailyMinutes = [
  { value: "10", title: "10 minutes", description: "Fits into a busy schedule" },
  { value: "15", title: "15 minutes", description: "A balanced learning habit" },
  { value: "30", title: "30 minutes", description: "Focus deeply and progress faster" },
  { value: "45", title: "45 minutes", description: "Immerse yourself in English" },
];

const transitionProps = { type: "spring", stiffness: 500, damping: 30, mass: 0.5 } as const;

type Option = { value: string; title: string; description: string };

function OptionButton({
  option,
  isSelected,
  onClick,
}: {
  option: Option;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      whileTap={{ scale: 0.98 }}
      className={`flex w-full items-center justify-between rounded-2xl border bg-card px-5 py-4 text-left transition-colors hover:bg-accent ${
        isSelected
          ? "border-foreground text-foreground shadow-sm"
          : "border-border text-card-foreground"
      }`}
      aria-pressed={isSelected}
    >
      <span className="flex flex-col gap-1">
        <span className="text-base font-semibold">{option.title}</span>
        <span className="text-sm text-muted-foreground">{option.description}</span>
      </span>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-foreground bg-foreground" : "border-muted-foreground"}`}
      >
        {isSelected && <Check className="h-3 w-3 text-background" strokeWidth={2.5} />}
      </span>
    </motion.button>
  );
}

export default function OnboardingForm() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedWords, setSelectedWords] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const totalSteps = 3;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canProceed =
    currentStep === 1
      ? selectedLevel !== ""
      : currentStep === 2
        ? selectedWords !== ""
        : selectedMinutes !== "";

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed) setCurrentStep((step) => step + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedLevel || !selectedWords || !selectedMinutes || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Unable to verify your account.");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          proficiency_level: selectedLevel,
          daily_new_words_goal: Number(selectedWords),
          daily_minutes_goal: Number(selectedMinutes),
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      router.replace("/dashboard");
    } catch (error) {
      console.error("Onboarding submit error:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepContent = [
    { title: "What is your English level?", description: "Choose the level that best fits you" },
    {
      title: "How many new words do you want to learn each day?",
      description: "A small goal makes it easier to stay consistent",
    },
    {
      title: "How many minutes do you want to study each day?",
      description: "Choose a routine you can maintain long term",
    },
  ][currentStep - 1];

  const options = currentStep === 1 ? levels : currentStep === 2 ? dailyWords : dailyMinutes;
  const selectedValue =
    currentStep === 1 ? selectedLevel : currentStep === 2 ? selectedWords : selectedMinutes;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-8 text-foreground sm:p-8">
      {errorMessage && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <div className="w-full max-w-[540px]">
        <header className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Set your learning goals
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} / {totalSteps}
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            aria-label={`Progress: step ${currentStep} of ${totalSteps}`}
          >
            <motion.div
              className="h-full rounded-full bg-blue-500"
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.section
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="mb-3 text-balance text-2xl font-semibold tracking-tight text-foreground">
              {stepContent.title}
            </h1>
            <p className="mb-9 text-base leading-6 text-muted-foreground">
              {stepContent.description}
            </p>
            <motion.div className="flex flex-col gap-3" layout transition={transitionProps}>
              {options.map((option) => (
                <OptionButton
                  key={option.value}
                  option={option}
                  isSelected={selectedValue === option.value}
                  onClick={() => {
                    if (currentStep === 1) setSelectedLevel(option.value);
                    else if (currentStep === 2) setSelectedWords(option.value);
                    else setSelectedMinutes(option.value);
                  }}
                />
              ))}
            </motion.div>
          </motion.section>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 rounded-full px-5 py-3 font-medium transition-all ${currentStep === 1 ? "pointer-events-none opacity-0" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all ${canProceed ? "bg-primary text-primary-foreground hover:bg-primary/90" : "cursor-not-allowed bg-zinc-800 text-zinc-600"}`}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all ${canProceed ? "bg-primary text-primary-foreground hover:bg-primary/90" : "cursor-not-allowed bg-zinc-800 text-zinc-600"}`}
            >
              {isSubmitting ? "Saving..." : "Start learning"} <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
