// c:/Projects/space/app/english/speaking/page.tsx
import { AlphabetCourses } from "@/components/Courses/alphabet-courses";
import { Suspense } from "react";

export default async function SpeakingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div className="text-center py-10">Đang tải danh sách khóa học...</div>}>
        {/* Truyền object đã await xuống AlphabetCourses */}
        <AlphabetCourses searchParams={sp} />
      </Suspense>
    </div>
  );
}
