import { supabaseBrowser } from "@/lib/supabase/client";

export default async function LevelPage({ params }: { params: any }) {
  console.log("Params received:", params);

  const { data } = await supabaseBrowser.from("levels").select("*");

  console.log("Fetched levels:", data);

  console.log("Current params:", params);

  // Lấy unitId và levelId từ params
  const unitId = params.unitId as string;
  const levelId = params.levelId as string;

  return (
    <div>
      <h1>Lesson Unit: {unitId}</h1>
      <h2>Level: {levelId}</h2>
    </div>
  );
}
