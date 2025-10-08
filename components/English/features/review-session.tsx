// components/English/features/review-session.tsx
"use client";

import { supabase } from "@/lib/supabase/public";
import { VocabularyCard } from "@/types/vocabulary";
import { useEffect, useState, useCallback } from "react";
import { ScoreCard } from "../ScoreCard";
import { EmptyState } from "@/components/Fallback/empty-state";
import { BookCopy } from "lucide-react";
import { shuffleArray } from "@/lib/utils";
import { MultipleChoiceReview, MCQProps } from "./multiple-choice-review";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// --- CÁC TYPE VÀ INTERFACE ---
type ReviewItem = VocabularyCard & {
  review_id: number;
  repetition_count: number;
  easiness_factor: number;
  interval_days: number;
};

interface GeneratedMCQ {
  type: "mcq";
  props: MCQProps;
}

type GeneratedExercise = GeneratedMCQ; // Có thể mở rộng sau
type FeedbackQuality = 0 | 1 | 2 | 3 | 4 | 5; // Chất lượng phản hồi (0=sai hẳn, 5=rất dễ)

// --- COMPONENT PHỤ: CÁC NÚT PHẢN HỒI ---
const FeedbackControls = ({ onFeedback }: { onFeedback: (quality: FeedbackQuality) => void }) => (
  <motion.div
    className="flex flex-wrap justify-center gap-3 mt-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Button variant="destructive" onClick={() => onFeedback(1)}>
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

  // --- LOGIC CỐT LÕI CỦA SRS (SuperMemo 2 Algorithm) ---
  const calculateSRS = (item: ReviewItem, quality: FeedbackQuality) => {
    let { easiness_factor, repetition_count, interval_days } = item;

    if (quality < 3) {
      // Nếu trả lời sai hoặc "Again"
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
      next_review: nextReviewDate.toISOString().split("T")[0],
    };
  };

  // --- HÀM XỬ LÝ PHẢN HỒI VÀ CHUYỂN CÂU HỎI ---
  const handleFeedback = async (quality: FeedbackQuality) => {
    const currentItem = reviewQueue[currentIndex];
    const newSRSData = calculateSRS(currentItem, quality);

    // Cập nhật lịch ôn tập trên Supabase
    await supabase.from("review_queue").update(newSRSData).eq("id", currentItem.review_id);

    // Chuyển sang câu hỏi tiếp theo
    moveToNextItem();
  };

  const moveToNextItem = () => {
    if (currentIndex < reviewQueue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateExercise(reviewQueue[nextIndex]);
      setIsAnswered(false);
    } else {
      setSessionComplete(true);
    }
  };

  // --- LOGIC SINH BÀI TẬP (BAO GỒM TRẮC NGHIỆM) ---
  const generateExercise = useCallback(async (item: ReviewItem) => {
    setCurrentExercise(null); // Xóa bài tập cũ

    // Tạm thời luôn tạo MCQ, có thể thêm logic chọn dạng bài tập ở đây
    const { data: distractors } = await supabase
      .from("vocabularies")
      .select("id, word, definition")
      .neq("id", item.id)
      .limit(3);

    if (!distractors || distractors.length < 3) {
      // Fallback nếu không đủ đáp án nhiễu (hiếm khi xảy ra)
      console.error("Not enough distractors for MCQ.");
      moveToNextItem(); // Bỏ qua từ này
      return;
    }

    const mcqProps: MCQProps = {
      question: `What is the definition of "${item.word}"?`,
      options: shuffleArray([
        { id: item.id, text: item.definition || "" },
        ...distractors.map((d) => ({ id: d.id, text: d.definition || "" })),
      ]),
      correctAnswerId: item.id,
      onAnswer: (isCorrect) => {
        setIsAnswered(true); // Hiển thị các nút feedback
        if (!isCorrect) {
          // Nếu sai, tự động coi như người dùng bấm "Again" sau 2 giây
          setTimeout(() => handleFeedback(0), 2000);
        }
      },
    };

    setCurrentExercise({ type: "mcq", props: mcqProps });
  }, []);

  // --- FETCH DỮ LIỆU KHI COMPONENT ĐƯỢC LOAD ---
  useEffect(() => {
    const fetchReviewQueue = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const { data: queueData } = await supabase
        .from("review_queue")
        .select(`*, vocabularies (*)`)
        .lte("next_review", today)
        .order("next_review", { ascending: true }) // Ưu tiên từ cũ hơn
        .limit(20);

      if (queueData) {
        const items: ReviewItem[] = queueData.map((item: any) => ({
          ...item.vocabularies,
          review_id: item.id,
          repetition_count: item.repetition_count,
          easiness_factor: item.easiness_factor,
          interval_days: item.interval_days,
        }));
        setReviewQueue(items);
        if (items.length > 0) {
          generateExercise(items[0]);
        }
      }
      setIsLoading(false);
    };

    fetchReviewQueue();
  }, [generateExercise]);

  const handleRestart = () => window.location.reload(); // Cách đơn giản nhất để bắt đầu lại

  // --- RENDER CÁC TRẠNG THÁI UI ---
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
          message="Great job! You've completed your review for now."
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

  const renderReviewComponent = () => {
    if (!currentExercise) return <div className="text-center">Generating exercise...</div>;
    return <MultipleChoiceReview {...currentExercise.props} />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Review Session</h1>
        <p className="text-muted-foreground">
          {currentIndex + 1} / {reviewQueue.length}
        </p>
      </div>
      {renderReviewComponent()}

      {/* Hiển thị các nút Feedback sau khi đã trả lời */}
      {isAnswered && <FeedbackControls onFeedback={handleFeedback} />}
    </div>
  );
}
