// Giả sử file này là: c:/Projects/space/app/english/speaking/page.tsx
import { Suspense } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { AlphabetCourses } from "@/components/courses/alphabet-courses";

export default async function SpeakingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Luyện Nói Tiếng Anh</h1>
      </FadeIn>

      <Suspense fallback={<div className="text-center py-10">Đang tải danh sách khóa học...</div>}>
        <AlphabetCourses searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
