"use client";

import { supabase } from "@/lib/supabase/public";
import { VocabularyCard } from "@/types/vocabulary";
import { useEffect, useState, useCallback } from "react";
import { ScoreCard } from "../ScoreCard";
import { EmptyState } from "@/components/Fallback/empty-state";
import { BookCopy } from "lucide-react";
import { shuffleArray } from "@/lib/utils";
import { MultipleChoiceReview } from "./multiple-choice-review";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// ===== Types =====

// Row from srs_cards + joined vocab
type ReviewItem = VocabularyCard & {
  card_id: number; // srs_cards.id (int8)
  vocab_id: string;

  repetition_count: number;
  easiness_factor: number;
  interval_days: number;
  due_at: string; // timestamptz ISO
  lane: "flashcard" | "speaking" | "listening" | "reading" | "writing";
};

type FeedbackQuality = 0 | 3 | 4 | 5; // dùng đúng chuẩn SM-2 UI: Again/Hard/Good/Easy

interface MCQProps {
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  onAnswer: (isCorrect: boolean) => void;
}

type GeneratedExercise = {
  type: "mcq";
  props: MCQProps;
};

// ===== UI: Feedback buttons =====
const FeedbackControls = ({ onFeedback }: { onFeedback: (quality: FeedbackQuality) => void }) => (
  <motion.div
    className="flex flex-wrap justify-center gap-3 mt-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Button variant="destructive" onClick={() => onFeedback(0)}>
      Again
    </Button>
    <Button variant="outline" onClick={() => onFeedback(3)}>
      Hard
    </Button>
    <Button variant="outline" onClick={() => onFeedback(4)}>
      Good
    </Button>
    <Button variant="secondary" onClick={() => onFeedback(5)}>
      Easy
    </Button>
  </motion.div>
);

export function ReviewSession() {
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // ===== SM-2 (Anki-like) 계산 =====
  // item: current srs card snapshot
  // quality: 0/3/4/5 (Again/Hard/Good/Easy)
  const calculateSRS = (item: ReviewItem, quality: FeedbackQuality) => {
    let easiness_factor = item.easiness_factor ?? 2.5;
    let repetition_count = item.repetition_count ?? 0;
    let interval_days = item.interval_days ?? 0;

    // SuperMemo-2 core
    if (quality < 3) {
      repetition_count = 0;
      interval_days = 1;
    } else {
      repetition_count += 1;
      if (repetition_count === 1) {
        interval_days = 1;
      } else if (repetition_count === 2) {
        interval_days = 6;
      } else {
        interval_days = Math.round(interval_days * easiness_factor);
      }
    }

    easiness_factor = easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easiness_factor < 1.3) easiness_factor = 1.3;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval_days);

    return {
      repetition_count,
      easiness_factor,
      interval_days,
      due_at: nextReviewDate.toISOString(), // timestamptz
      last_reviewed_at: new Date().toISOString(),
      // nếu bạn chưa có state thì bỏ qua; nếu có state thì có thể update ở đây
      // state: quality < 3 ? "learning" : repetition_count >= 2 ? "review" : "learning",
    };
  };

  const moveToNextItem = useCallback(() => {
    if (currentIndex < reviewQueue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setIsAnswered(false);
      generateExercise(reviewQueue[nextIndex]);
    } else {
      setSessionComplete(true);
    }
  }, [currentIndex, reviewQueue]);

  // ===== Update SRS + Insert Review Log =====
  const handleFeedback = useCallback(
    async (quality: FeedbackQuality, item: ReviewItem, questionType?: string) => {
      const newSRSData = calculateSRS(item, quality);

      // 1) update srs_cards
      const { error: updateErr } = await supabase
        .from("srs_cards")
        .update(newSRSData)
        .eq("id", item.card_id);

      if (updateErr) {
        console.error("Update srs_cards failed:", updateErr);
        // vẫn move next để UX không bị kẹt, nhưng bạn có thể return nếu muốn strict
      }

      // 2) insert review_logs (bảng riêng)
      // Nếu bạn chưa tạo review_logs thì đoạn này sẽ báo lỗi — đúng design thì nên có.
      const { error: logErr } = await supabase.from("review_logs").insert({
        srs_card_id: item.card_id,
        rating: quality, // nếu DB constraint 0..3 thì bạn đổi mapping (0,1,2,3). Còn nếu cho 0..5 thì ok.
        question_type: questionType ?? "mcq",
        answer: null,
        score: null,
        response_ms: null,
      });

      if (logErr) {
        console.error("Insert review_logs failed:", logErr);
      }

      moveToNextItem();
    },
    [moveToNextItem]
  );

  // ===== Generate Exercise (MCQ for now) =====
  const generateExercise = useCallback(
    async (item: ReviewItem) => {
      setCurrentExercise(null);

      // fetch 3 distractors (same table: vocabulary)
      const { data: distractors, error } = await supabase
        .from("vocabulary")
        .select("id, definition, translation")
        .neq("id", item.id) // item.id from VocabularyCard
        .not("definition", "is", null)
        .limit(3);

      if (error) {
        console.error("Fetch distractors failed:", error);
        // fallback: skip
        moveToNextItem();
        return;
      }

      if (!distractors || distractors.length < 3) {
        console.error("Not enough distractors for MCQ.");
        moveToNextItem();
        return;
      }

      const correctText = item.definition || item.translation || "";
      const options = shuffleArray([
        { id: item.id, text: correctText },
        ...distractors.map((d) => ({
          id: d.id as string,
          text: d.definition || d.translation || "",
        })),
      ]);

      const mcqProps: MCQProps = {
        question: `What is the meaning of "${item.word}"?`,
        options,
        correctAnswerId: item.id,
        onAnswer: (isCorrect: boolean) => {
          setIsAnswered(true);

          if (!isCorrect) {
            // Auto "Again" after 1.2s (optional)
            setTimeout(() => {
              handleFeedback(0, item, "mcq_meaning");
            }, 1200);
          }
        },
      };

      setCurrentExercise({ type: "mcq", props: mcqProps });
    },
    [handleFeedback, moveToNextItem]
  );

  // ===== Fetch review queue =====
  useEffect(() => {
    const fetchReviewQueue = async () => {
      setIsLoading(true);

      const lane: ReviewItem["lane"] = "flashcard"; // MVP: review flashcard lane

      const { data: queueData, error } = await supabase
        .from("srs_cards")
        .select(
          `
          id,
          vocab_id,
          repetition_count,
          easiness_factor,
          interval_days,
          due_at,
          lane,
          vocabulary (*)
        `
        )
        .eq("lane", lane)
        .lte("due_at", new Date().toISOString())
        .order("due_at", { ascending: true })
        .limit(20);

      if (error) {
        console.error("Fetch srs queue failed:", error);
        setReviewQueue([]);
        setIsLoading(false);
        return;
      }

      if (queueData && queueData.length > 0) {
        const items: ReviewItem[] = queueData.map((row: any) => ({
          // row.vocabulary is the joined vocab record
          ...row.vocabulary,
          card_id: row.id,
          vocab_id: row.vocab_id,
          repetition_count: row.repetition_count,
          easiness_factor: row.easiness_factor,
          interval_days: row.interval_days,
          due_at: row.due_at,
          lane: row.lane,
        }));

        setReviewQueue(items);
        setCurrentIndex(0);
        setIsAnswered(false);
        generateExercise(items[0]);
      } else {
        setReviewQueue([]);
      }

      setIsLoading(false);
    };

    fetchReviewQueue();
  }, [generateExercise]);

  const handleRestart = () => window.location.reload();

  // ===== Render states =====
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ScoreCard
          score={reviewQueue.length}
          total={reviewQueue.length}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <EmptyState
        icon={BookCopy}
        title="Nothing to review today!"
        description="You're all caught up. Keep learning new words to fill your review queue."
      />
    );
  }

  const currentItem = reviewQueue[currentIndex];

  const renderReviewComponent = () => {
    if (!currentExercise) return <div className="text-center">Generating exercise...</div>;
    return <MultipleChoiceReview {...currentExercise.props} />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Review Session</h1>
        <p className="text-muted-foreground">
          {currentIndex + 1} / {reviewQueue.length} • Lane: {currentItem?.lane}
        </p>
      </div>

      {renderReviewComponent()}

      {/* Show feedback controls after answered */}
      {isAnswered && (
        <FeedbackControls onFeedback={(q) => handleFeedback(q, currentItem, "mcq_meaning")} />
      )}
    </div>
  );
}
