"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/public";

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
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ôn tập từ vựng</h1>
    </div>
  );
}
