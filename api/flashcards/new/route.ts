// app/api/flashcards/new/route.ts

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const cookieStore = cookies();
const supabase = createClient(cookieStore);

export async function GET() {
  const { data, error } = await supabase
    .from("vocabularies")
    .select("id, word, meaning")
    .eq("is_learned", false)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.error();
  return NextResponse.json(data);
}
