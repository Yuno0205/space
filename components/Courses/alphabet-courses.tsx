import { supabase } from "@/lib/supabase/public";
import Link from "next/link";
import { LetterCard } from "./letter-card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Course } from "@/types/course";
import { PostgrestError } from "@supabase/supabase-js";

const ITEMS_PER_PAGE = 6;

interface AlphabetCoursesProps {
  searchParams?: {
    page?: string;
    [key: string]: string | string[] | undefined; // Cho phép các search params khác
  };
}

// Helper function to build string href for pagination, preserving other search params
const buildPaginationHref = (
  newPage: number,
  currentSearchParams?: Record<string, string | string[] | undefined> // Thay đổi kiểu dữ liệu ở đây
): string => {
  const params = new URLSearchParams();

  // Tạo một bản sao "an toàn" của searchParams để duyệt
  const safeSearchParamsToIterate = currentSearchParams ? { ...currentSearchParams } : {};

  // Duyệt qua bản sao an toàn này
  for (const [key, value] of Object.entries(safeSearchParamsToIterate)) {
    if (key === "page") continue; // Bỏ qua 'page' cũ, sẽ được ghi đè

    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        // value ở đây đã được đảm bảo là string (vì không phải array và không phải undefined)
        params.append(key, value);
      }
    }
  }

  params.set("page", String(newPage));
  const queryString = params.toString();
  return `?${queryString}`;
};

// Helper function to generate page numbers and ellipses for pagination (giữ nguyên từ lần trước)
const generatePaginationItems = (currentPage: number, totalPages: number): (number | string)[] => {
  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }
  const uniqueSortedRange = [...new Set(range)].sort((a, b) => a - b);
  for (const i of uniqueSortedRange) {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l > 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
};

export async function AlphabetCourses({ searchParams }: AlphabetCoursesProps) {
  // Đợi và trích xuất giá trị từ searchParams ngay từ đầu
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const {
    data: courses,
    error,
    count,
  }: {
    data: Course[] | null;
    error: PostgrestError | null;
    count: number | null;
  } = await supabase
    .from("courses")
    .select("*", { count: "exact" })
    .order("letter", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching courses:", error);
    return (
      <div className="text-center py-10 text-red-500">
        Có lỗi xảy ra khi tải danh sách khóa học.
      </div>
    );
  }

  const totalCourses = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCourses / ITEMS_PER_PAGE));

  if (!courses || courses.length === 0) {
    if (currentPage > 1 && totalCourses > 0) {
      const firstPageHref = buildPaginationHref(1, resolvedParams);
      return (
        <div className="text-center py-10 text-zinc-400">
          <p>Không tìm thấy khóa học nào cho trang này.</p>
          <Link href={firstPageHref} className="text-blue-500 hover:underline mt-2 inline-block">
            Quay về trang đầu
          </Link>
        </div>
      );
    }
    return <div className="text-center py-10 text-zinc-400">Hiện chưa có khóa học nào.</div>;
  }

  const paginationItems = generatePaginationItems(currentPage, totalPages);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course: Course) => (
          <LetterCard course={course} key={course.id} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1
                      ? buildPaginationHref(currentPage - 1, resolvedParams)
                      : undefined
                  }
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "pointer-events-none opacity-60" : undefined}
                />
              </PaginationItem>

              {paginationItems.map((item, index) => (
                <PaginationItem
                  key={typeof item === "string" ? `ellipsis-${item}-${index}` : `page-${item}`}
                >
                  {item === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={buildPaginationHref(item as number, resolvedParams)} // Sử dụng resolvedParams
                      isActive={currentPage === item}
                      aria-current={currentPage === item ? "page" : undefined}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? buildPaginationHref(currentPage + 1, resolvedParams)
                      : undefined
                  }
                  aria-disabled={currentPage >= totalPages}
                  className={
                    currentPage >= totalPages ? "pointer-events-none opacity-60" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
