import { supabaseBrowser } from "@/lib/supabase/client";

export const revalidate = 0; // SSR mỗi lần

export default async function LessonPage({
  params,
}: {
  params: { levelId: string; lessonId: string };
}) {
  const levelId = Number(params.levelId);
  const lessonId = Number(params.lessonId);

  const { data: rows, error } = await supabaseBrowser
    .from("lesson_vocabularies")
    .select(
      `
    vocabularies (
      id,
      word,
      phonetic,
        audio_url,
        word_type,
        definition,
        translation,
        synonyms,
        antonyms,
      is_learned
    )
  `
    )
    .eq("lesson_id", lessonId);

  if (error) {
    // Nếu có lỗi lớn (ví dụ kết nối, quyền) thì trả về thông báo
    return <div style={{ padding: "2rem" }}>Lỗi: {error.message}</div>;
  }
  if (!rows || rows.length === 0) {
    // Nếu không có kết quả, có thể lesson không thuộc level hoặc chưa có từ
    return (
      <div style={{ padding: "2rem" }}>
        Không tìm thấy từ cho Lesson {lessonId} của Level {levelId}.
      </div>
    );
  }

  // 2. Lấy riêng mảng vocabularies
  console.log("Fetched rows:", rows);

  // 3. Render UI
  return <main style={{ padding: "2rem" }}>Haha</main>;
}
