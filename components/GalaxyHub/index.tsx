import ComicButton from "../ComicButton";

export default async function GalaxyHub() {
  // const cookieStore = cookies();
  // const supabase = createClient(cookieStore);

  // const { data: voca, error } = await supabase.from("vocabularies").select();

  // if (error) {
  //   // Consider proper error handling instead of just logging
  //   // console.error("Error fetching vocabularies:", error.message);
  //   // Return an error state or fallback UI
  //   return <div>Failed to load data</div>;
  // }

  return (
    <div className="w-full flex items-center justify-center relative z-1 h-[79px]">
      <ComicButton />
    </div>
  );
}
