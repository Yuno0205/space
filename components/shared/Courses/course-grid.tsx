"use client";

import { Course } from "@/types/course";
import { CourseCard } from "./course-card";

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.letter} course={course} />
      ))}
    </div>
  );
}
