"use client";

import { HomeIcon } from "lucide-react"; // Giả sử bạn đã cài đặt lucide-react
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type BreadcrumbProps = React.HTMLAttributes<HTMLElement>;

const Breadcrumb = ({ className, ...props }: BreadcrumbProps) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((path) => path); // Loại bỏ các path rỗng

  return (
    <nav
      aria-label="breadcrumb"
      className={`flex items-center space-x-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-300 ${className || ""}`}
      {...props}
    >
      {/* Link Home luôn hiển thị và trỏ về / */}
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-neutral-200 hover:text-black dark:hover:bg-neutral-700 dark:hover:text-white"
        aria-label="Trang chủ"
      >
        <HomeIcon className="h-4 w-4 flex-shrink-0" />
        {/* Bạn có thể thêm chữ "Home" nếu muốn */}
        {/* <span className="hidden sm:inline">Home</span> */}
      </Link>

      {/* Chỉ hiển thị các segment con nếu có */}
      {segments.length > 0 &&
        segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          // Xử lý text hiển thị cho segment (ví dụ: thay thế '-' bằng ' ' và viết hoa chữ cái đầu)
          const displayText = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <React.Fragment key={href}>
              <span
                className="select-none text-neutral-400 dark:text-neutral-500"
                aria-hidden="true"
              >
                /
              </span>
              {isLast ? (
                <span
                  className="rounded-md px-2 py-1 capitalize text-black dark:text-white"
                  aria-current="page"
                >
                  {displayText}
                </span>
              ) : (
                <Link
                  href={href}
                  className="rounded-md px-2 py-1 capitalize transition-colors hover:bg-neutral-200 hover:text-black dark:hover:bg-neutral-700 dark:hover:text-white"
                >
                  {displayText}
                </Link>
              )}
            </React.Fragment>
          );
        })}
    </nav>
  );
};

export default Breadcrumb;
