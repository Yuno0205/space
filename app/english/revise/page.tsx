"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase/client";

// Định nghĩa kiểu cho thẻ ôn tập
interface ReviewCard {
  id: string;
  word: string;
  meaning: string;
  repetition_count: number;
  interval_days: number;
  easiness_factor: number;
  next_review: string;
}

export default function ReviewPage() {
  const [cards, setCards] = useState<ReviewCard[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      const { data, error } = await supabase
        .from("review_queue")
        .select(
          "vocab: vocabularies(id,word,definition), repetition_count, interval_days, easiness_factor, next_review"
        )
        .lte("next_review", new Date().toISOString())
        .limit(100);

      if (error) {
        console.error("Error fetching review cards:", error);
        return;
      }

      console.log(data);

      // Chuyển về định dạng ReviewCard
      // const formatted = (data ?? []).map((r: any) => ({
      //   id: r.vocab.id,
      //   word: r.vocab.word,
      //   meaning: r.vocab.meaning,
      //   repetition_count: r.repetition_count,
      //   interval_days: r.interval_days,
      //   easiness_factor: r.easiness_factor,
      //   next_review: r.next_review,
      // }));
    };

    fetchCards();
  }, []);

  console.log("Cards:", cards);

  // Xử lý khi bấm Đã biết / Chưa biết
  const handleAnswer = async (card: ReviewCard, known: boolean): Promise<void> => {
    let { repetition_count: n, interval_days: i, easiness_factor: ef } = card;
    const { id } = card;

    if (!known) {
      n = 0;
      i = 1;
    } else {
      n += 1;
      if (n === 1) i = 1;
      else if (n === 2) i = 6;
      else i = Math.round(i * ef);
      ef = Math.max(1.3, ef + 0.1);
    }

    const nextReview = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString();

    if (n >= 3) {
      // Xóa khỏi queue khi đạt ngưỡng
      const { error } = await supabase.from("review_queue").delete().eq("vocab_id", id);
      if (error) console.error("Error deleting card:", error);
    } else {
      // Cập nhật lại lịch ôn
      const { error } = await supabase
        .from("review_queue")
        .update({
          repetition_count: n,
          interval_days: i,
          easiness_factor: ef,
          next_review: nextReview,
        })
        .eq("vocab_id", id);
      if (error) console.error("Error updating card:", error);
    }

    // Cập nhật UI
    setCards((cs) => cs.filter((x) => x.id !== id));
  };

  return (
    <div>
      {cards.map((c) => (
        <div key={c.id} className="card">
          <h3>{c.word}</h3>
          <p>{c.meaning}</p>
          <button onClick={() => handleAnswer(c, true)}>Đã biết</button>
          <button onClick={() => handleAnswer(c, false)}>Chưa biết</button>
        </div>
      ))}
    </div>
  );
}
