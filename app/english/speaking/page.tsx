// Giả sử file này là: c:/Projects/space/app/english/speaking/page.tsx
import { AlphabetCourses } from "@/components/courses/alphabet-courses";
import { Suspense } from "react";

export default async function SpeakingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div className="text-center py-10">Đang tải danh sách khóa học...</div>}>
        <AlphabetCourses searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
