import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function GalaxuHub() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: voca } = await supabase.from("vocabularies").select();

  console.log("voca", voca);

  return <ul>Haha</ul>;
}
