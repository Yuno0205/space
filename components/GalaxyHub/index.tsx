import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function GalaxyHub() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: voca, error } = await supabase.from("vocabularies").select();

  if (error) {
    // Consider proper error handling instead of just logging
    console.error("Error fetching vocabularies:", error.message);
    // Return an error state or fallback UI
    return <div>Failed to load data</div>;
  }

  console.log("vocabularies", voca);

  return null;
}
