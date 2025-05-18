// hooks/use-mobile.ts (Hoặc đổi tên thành use-mobile.tsx nếu bạn thích, nhưng giữ lại code này)
"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768; // Định nghĩa breakpoint ở một chỗ

export function useIsMobile(): boolean {
  // Thêm kiểu trả về cho rõ ràng
  // Khởi tạo isMobile là false.
  // Điều này có nghĩa là ở server-side render và lần render đầu tiên ở client trước khi useEffect chạy,
  // component sẽ coi như không phải mobile.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Hàm này chỉ chạy ở client
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkDevice(); // Kiểm tra ngay khi component mount ở client

    window.addEventListener("resize", checkDevice);

    // Cleanup listener khi component unmount
    return () => window.removeEventListener("resize", checkDevice);
  }, []); // Dependency array rỗng để chỉ chạy 1 lần khi mount và cleanup khi unmount

  return isMobile;
}
