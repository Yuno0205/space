"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HUDButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "cyan" | "purple" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function HUDButton({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "md",
  className,
}: HUDButtonProps) {
  const sizeClasses = {
    sm: "px-8 py-3 text-base",
    md: "px-16 py-6 text-xl",
    lg: "px-20 py-8 text-2xl",
  };

  const variantClasses = {
    default: {
      corner: "group-hover:bg-cyan-400 group-hover:shadow-cyan-400/50",
      glow: "bg-cyan-400/20",
    },
    cyan: {
      corner: "group-hover:bg-cyan-400 group-hover:shadow-cyan-400/50",
      glow: "bg-cyan-400/20",
    },
    purple: {
      corner: "group-hover:bg-purple-400 group-hover:shadow-purple-400/50",
      glow: "bg-purple-400/20",
    },
    gold: {
      corner: "group-hover:bg-yellow-400 group-hover:shadow-yellow-400/50",
      glow: "bg-yellow-400/20",
    },
  };

  return (
    <div className="relative group">
      {/* Main button using shadcn/ui Button component */}
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "bg-white rounded-none text-black hover:bg-gray-100 font-bold h-auto border-2 border-black hover:shadow-lg  transition-all duration-300 uppercase tracking-wider relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          sizeClasses[size],
          className
        )}
      >
        <span className="relative z-10">{children}</span>

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
      </Button>

      {/* Corner decorations with animations */}
      {/* Top left corner */}
      <div className="absolute -top-1 -left-1 w-6 h-6 group-hover:scale-110 transition-all duration-300">
        <div
          className={cn(
            "absolute top-0 left-0 w-4 h-0.5 bg-white group-hover:shadow-md transition-all duration-300 group-hover:w-6",
            variantClasses[variant].corner
          )}
        ></div>
        <div
          className={cn(
            "absolute top-0 left-0 w-0.5 h-4 bg-white group-hover:shadow-md transition-all duration-300 group-hover:h-6",
            variantClasses[variant].corner
          )}
        ></div>
      </div>

      {/* Top right corner */}
      <div className="absolute -top-1 -right-1 w-6 h-6 group-hover:scale-110 transition-all duration-300 delay-75">
        <div
          className={cn(
            "absolute top-0 right-0 w-4 h-0.5 bg-white group-hover:shadow-md transition-all duration-300 group-hover:w-6",
            variantClasses[variant].corner
          )}
        ></div>
        <div
          className={cn(
            "absolute top-0 right-0 w-0.5 h-4 bg-white group-hover:shadow-md transition-all duration-300 group-hover:h-6",
            variantClasses[variant].corner
          )}
        ></div>
      </div>

      {/* Bottom left corner */}
      <div className="absolute -bottom-1 -left-1 w-6 h-6 group-hover:scale-110 transition-all duration-300 delay-150">
        <div
          className={cn(
            "absolute bottom-0 left-0 w-4 h-0.5 bg-white group-hover:shadow-md transition-all duration-300 group-hover:w-6",
            variantClasses[variant].corner
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-0 left-0 w-0.5 h-4 bg-white group-hover:shadow-md transition-all duration-300 group-hover:h-6",
            variantClasses[variant].corner
          )}
        ></div>
      </div>

      {/* Bottom right corner */}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 group-hover:scale-110 transition-all duration-300 delay-200">
        <div
          className={cn(
            "absolute bottom-0 right-0 w-4 h-0.5 bg-white group-hover:shadow-md transition-all duration-300 group-hover:w-6",
            variantClasses[variant].corner
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-0 right-0 w-0.5 h-4 bg-white group-hover:shadow-md transition-all duration-300 group-hover:h-6",
            variantClasses[variant].corner
          )}
        ></div>
      </div>

      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className={cn("absolute inset-0 blur-xl scale-110", variantClasses[variant].glow)}
        ></div>
      </div>
    </div>
  );
}
