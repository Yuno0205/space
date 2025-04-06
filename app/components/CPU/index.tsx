"use client";
import * as React from "react";
import "./style.css"; // Import CSS riêng để xử lý animation

const CPUComponent = () => (
  <svg
    width={891}
    height={264}
    fill="none"
    aria-label="A bunch of connecting lines that form into the CPU, with the text Powered By on top of the the CPU. Gradient lines are animating along the drawn lines, dissolving into the CPU in the center."
    data-lines="true"
  >
    {/* Ví dụ áp dụng animation vào path */}
    <path
      className="draw-stroke"
      stroke="var(--geist-foreground)"
      strokeDasharray="1px 1px"
      strokeOpacity={0.1}
      d="M388 96V68a4 4 0 0 0-4-4h-74M349 150H73a4 4 0 0 0-4 4v20"
    />
    <path
      className="draw-stroke delay-1"
      stroke="url(#a)"
      strokeWidth={2}
      d="M547 130h275a4 4 0 0 1 4 4v130"
    />
    <path
      className="draw-stroke delay-2"
      stroke="url(#b)"
      strokeLinecap="round"
      strokeWidth={2}
      d="M349 130H5a4 4 0 0 0-4 4v130"
    />
    {/* Thêm các path khác tương tự nếu muốn */}

    {/* Các đường gradient, circle, v.v. giữ nguyên */}
    <circle cx={460} cy={64} r={4} fill="var(--geist-background)" />
    <circle
      cx={460}
      cy={64}
      r={3.5}
      stroke="var(--geist-foreground)"
      strokeOpacity={0.1}
    />
    <defs>
      <linearGradient
        id="a"
        x1={646.665}
        x2={662.059}
        y1={216.123}
        y2={274.577}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF7432" stopOpacity={0} />
        <stop offset={0.055} stopColor="#FF7432" />
        <stop offset={0.373} stopColor="#F7CC4B" />
        <stop offset={1} stopColor="#F7CC4B" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="b"
        x1={316.608}
        x2={279.762}
        y1={145.346}
        y2={207.737}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2EB9DF" stopOpacity={0} />
        <stop offset={0.05} stopColor="#2EB9DF" />
        <stop offset={1} stopColor="#2EB9DF" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

export default CPUComponent;
