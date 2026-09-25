"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailScores, PronunciationResultState } from "@/types/pronunciation";
import { cn, sentenceToIPA } from "@/utils";
import { analyzeSpeech, createNeutralWordDisplay } from "@/utils/pronunciation";
import { motion } from "framer-motion";
import { AlertTriangle, Mic, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { initialPronunciationResultState } from "../../practice/speaking-practice";
import { ReviewSubmission, SPEAKING_PASS_SCORE } from "../types";

type SpeakingQuestionProps = {
  question: {
    type: "speaking";
    prompt: string;
    meta?: {
      audioUrl?: string | null;
      sentence?: string | null;
    };
  };

  submitting: boolean;
  onSubmit: (submission: ReviewSubmission) => Promise<boolean>;
  onFeedback: (score: number | null) => void;
};

export function SpeakingQuestion({
  question,
  submitting,
  onSubmit,
  onFeedback,
}: SpeakingQuestionProps) {
  const targetText = question.meta?.sentence?.trim() || question.prompt.trim();

  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResultState>(() => ({
    ...initialPronunciationResultState,
    wordsForDisplay: createNeutralWordDisplay(targetText),
  }));

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSubmitted = useRef(false);

  const handlePronunciationResult = async (spokenText: string, sttConfidence: number) => {
    const analyzed = analyzeSpeech(targetText, spokenText, sttConfidence);

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: spokenText,
      overallScore: analyzed.overallScore,
      detailScores: analyzed.details as unknown as DetailScores | null,
      wordsForDisplay: analyzed.wordsForDisplay,
    }));

    const score = analyzed.overallScore ?? 0;

    onFeedback(score);

    if (isSubmitted.current) {
      return;
    }

    isSubmitted.current = true;

    const saved = await onSubmit({
      isCorrect: score >= SPEAKING_PASS_SCORE,
      score,
      answer: spokenText,
    });

    if (!saved) {
      isSubmitted.current = false;
    }
  };

  const startListening = () => {
    if (pronunciationResult.isListening) {
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setPronunciationResult((prev) => ({
        ...prev,
        error: "Your browser does not support the Web Speech API. Please try Chrome or Edge.",
      }));

      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-GB";

      recognition.onstart = () => {
        setPronunciationResult((prev) => ({
          ...prev,
          isListening: true,
          error: null,
        }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const bestAlternative = event.results[0][0];

        void handlePronunciationResult(
          bestAlternative.transcript.trim(),
          bestAlternative.confidence
        );
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorText = `Speech recognition error: ${event.error}`;

        if (event.error === "no-speech") {
          errorText = "No speech detected. Please try again.";
        } else if (event.error === "audio-capture") {
          errorText = "Microphone not found. Please check your device.";
        } else if (event.error === "not-allowed") {
          errorText = "Microphone access denied. Please grant permission.";
        }

        setPronunciationResult((prev) => ({
          ...prev,
          isListening: false,
          error: errorText,
        }));
      };

      recognition.onend = () => {
        setPronunciationResult((prev) => ({
          ...prev,
          isListening: false,
        }));
      };

      recognitionRef.current = recognition;
    }

    setPronunciationResult((prev) => ({
      ...prev,
      transcript: "",
      overallScore: null,
      detailScores: null,
      error: null,
      wordsForDisplay: createNeutralWordDisplay(targetText),
    }));

    try {
      recognitionRef.current.start();
    } catch (error) {
      const errorText =
        error instanceof Error && error.name === "InvalidStateError"
          ? "Recognition state error, please try again shortly."
          : "Could not start speech recognition.";

      setPronunciationResult((prev) => ({
        ...prev,
        isListening: false,
        error: errorText,
      }));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && pronunciationResult.isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetCurrentAttempt = () => {
    setPronunciationResult({
      ...initialPronunciationResultState,
      wordsForDisplay: createNeutralWordDisplay(targetText),
    });
    onFeedback(null);
    startListening();
  };

  const getScoreColor = (score: number | null): string => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return (
    <div className="space-y-6 bg-white p-2 text-black sm:p-4 dark:bg-transparent dark:text-white">
      {pronunciationResult.error && (
        <Alert
          variant="destructive"
          className="border-red-300 bg-red-100 text-red-800 dark:border-red-600 dark:bg-red-800 dark:text-red-300"
        >
          <AlertTriangle className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertDescription>{pronunciationResult.error}</AlertDescription>
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-white shadow-2xl dark:bg-black"
      >
        <Card className="border-gray-300 bg-white dark:border-gray-700 dark:bg-white/5">
          <CardHeader className="border-b border-gray-300 dark:border-gray-700">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="mr-2 h-5 w-5" />
                Speaking
              </div>
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {question.prompt}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 ">
            <div className="relative flex flex-col items-center justify-center space-y-6 min-h-[300px]">
              <div className="w-full text-center">
                <div className="flex min-h-[4em] flex-wrap items-center justify-center gap-x-2 gap-y-2">
                  {pronunciationResult.wordsForDisplay.map((wordData, index) => (
                    <span
                      key={`${wordData.text}-${index}`}
                      className={cn(
                        wordData.color,
                        "rounded-md px-2 py-1 text-2xl font-semibold transition-colors md:text-3xl text-gray-800 dark:text-gray-200"
                      )}
                    >
                      {wordData.text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-xl">
                  {sentenceToIPA(targetText)}
                </p>
              </div>

              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    pronunciationResult.isListening
                      ? {
                          scale: [1, 1.15, 1],
                          transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
                        }
                      : {}
                  }
                >
                  <Button
                    size="lg"
                    className={cn(
                      "h-20 w-20 rounded-full shadow-lg flex items-center justify-center",
                      pronunciationResult.isListening
                        ? "animate-pulse bg-red-600 hover:bg-red-700"
                        : "bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    )}
                    onClick={pronunciationResult.isListening ? stopListening : startListening}
                    title={pronunciationResult.isListening ? "Stop recording" : "Start recording"}
                    aria-label={
                      pronunciationResult.isListening ? "Stop recording" : "Start recording"
                    }
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                </motion.div>
              </div>

              {pronunciationResult.transcript ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-2xl rounded-lg border border-gray-300 bg-gray-100 p-6 shadow dark:border-gray-700 dark:bg-gray-700/30"
                >
                  <div className="mb-6 border-b border-gray-300 pb-6 dark:border-gray-600">
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      You said:
                    </p>
                    <p className="text-lg italic text-gray-800 dark:text-gray-200">
                      &quot;{pronunciationResult.transcript}&quot;
                    </p>
                  </div>

                  {pronunciationResult.overallScore !== null ? (
                    <div className="flex w-full flex-col items-center space-y-4">
                      <div className="mb-4 flex w-full items-center justify-between">
                        <h4 className="font-medium text-gray-800 dark:text-gray-300">Score:</h4>
                        <span
                          className={cn(
                            "text-3xl font-bold",
                            getScoreColor(pronunciationResult.overallScore)
                          )}
                        >
                          {pronunciationResult.overallScore}
                        </span>
                      </div>

                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetCurrentAttempt}
                          className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {submitting ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Saving speaking result...</p>
      ) : null}
    </div>
  );
}
