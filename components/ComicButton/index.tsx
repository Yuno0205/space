"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  twinkleSpeed: number;
}

const StarButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Lấy phần tử canvas và button
    const canvas = canvasRef.current;
    const button = buttonRef.current;

    // Kiểm tra null cho canvas và button
    if (!canvas || !button) return;

    // Lấy context 2D
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Đặt kích thước canvas
    canvas.width = button.offsetWidth;
    canvas.height = button.offsetHeight;

    // Mảng chứa ngôi sao
    const stars: Star[] = [];
    const numStars = 25;

    function createStar(): Star {
      return {
        x: Math.random() * (canvas?.width || 0),
        y: Math.random() * (canvas?.height || 0),
        radius: Math.random() * 0.7 + 0.3, // Ngôi sao nhỏ: 0.3-1px
        opacity: Math.random() * 0.3 + 0.7, // Độ sáng: 0.7-1
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      };
    }

    // Khởi tạo ngôi sao
    for (let i = 0; i < numStars; i++) {
      stars.push(createStar());
    }

    function drawStars() {
      if (!ctx) return;
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (canvas) {
          if (star.x < 0) star.x += canvas.width;
          if (star.x > canvas.width) star.x -= canvas.width;
          if (star.y < 0) star.y += canvas.height;
          if (star.y > canvas.height) star.y -= canvas.height;
        }

        star.opacity += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        if (star.opacity > 1) star.opacity = 1;
        if (star.opacity < 0.7) star.opacity = 0.7;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(drawStars);
    }

    drawStars();

    // Xử lý resize
    const handleResize = () => {
      canvas.width = button.offsetWidth;
      canvas.height = button.offsetHeight;
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
      }
    };

    window.addEventListener("resize", handleResize);

    // Xử lý hover
    const handleMouseEnter = () => {
      stars.forEach((star) => {
        star.speedX *= 1.5;
        star.speedY *= 1.5;
      });
    };

    const handleMouseLeave = () => {
      stars.forEach((star) => {
        star.speedX /= 1.5;
        star.speedY /= 1.5;
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Link
      href="https://x.ai/grok"
      className="relative inline-block px-7 py-3.5 text-lg font-bold text-white bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
      ref={buttonRef}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-300"
        style={{ zIndex: -1 }}
      />
      Mua Super
    </Link>
  );
};

export default StarButton;
