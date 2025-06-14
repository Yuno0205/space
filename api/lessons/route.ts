// api/lessons/route.ts
import { createClient } from "@/lib/supabase/server"; // Sử dụng server client nếu fetch từ backend
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ITEMS_PER_PAGE = 1;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const levelId = searchParams.get("levelId");
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!levelId || isNaN(parseInt(levelId, 10))) {
    return NextResponse.json({ error: "Missing or invalid levelId" }, { status: 400 });
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const {
      data: lessons,
      error,
      count,
    } = await supabase
      .from("lessons_with_progress")
      .select(
        `
        id,
        letter,
        name,
        description,
        learned_words,
        total_words,
        progress
      `,
        { count: "exact" }
      )
      .eq("level_id", parseInt(levelId, 10))
      .order("letter", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Error fetching lessons with pagination:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lessons, totalCount: count });
  } catch (err) {
    console.error("Unexpected error in API route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
