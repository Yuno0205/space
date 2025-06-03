import React, { useId } from "react";
import PropTypes from "prop-types";
import "./styles/style.scss";
import { cn } from "@/lib/utils";

const ProgressRing = ({
  progress = 0, // Giá trị từ 0 (0%) đến 1 (100%)
  size = 98, // Kích thước của SVG (width và height)
  trackColor = "rgb(var(--color-swan))", // Màu của vòng nền
  indicatorColor = "rgb(var(--color-snow))", // Màu của chấm tròn chỉ báo
  staticPathColor = "var(--path-unit-character-color)", // Màu của path tĩnh (nếu có ý nghĩa)
  indicatorRadius = 4, // Bán kính của chấm tròn chỉ báo (gốc là 4)
  className = "progress-ring-component", // Class CSS cho thẻ svg ngoài cùng
}) => {
  // Đảm bảo progress nằm trong khoảng [0, 1]
  const currentProgress = Math.max(0, Math.min(1, progress));

  // Tạo ID duy nhất cho clipPath để tránh xung đột khi có nhiều instance
  const uniqueComponentId = useId();
  const clipPathId = `clip-progress-ring-${uniqueComponentId}`;

  // Các thông số bán kính dựa trên SVG gốc (viewBox 0 0 100 100, tâm tại 50,50)
  // Bán kính quỹ đạo cho tâm của chấm tròn chỉ báo.
  // Giá trị này được tính từ cx, cy gốc của circle trong SVG: sqrt((-3.9949...)^2 + (-45.826...)^2)
  const indicatorOrbitRadius = 45.99347068611901;

  // Góc ban đầu của chấm tròn trong SVG gốc (tính bằng atan2(cy_orig, cx_orig))
  // cx_orig = -3.9949609477190866
  // cy_orig = -45.82619651494328
  const startAngleRad = -1.657469365501038; // Math.atan2(cy_orig, cx_orig)

  // Tính toán góc hiện tại của chấm tròn dựa trên progress
  // Tiến trình sẽ bắt đầu từ vị trí gốc của chấm tròn và xoay theo chiều kim đồng hồ
  const currentAngleRad = startAngleRad + currentProgress * 2 * Math.PI;

  // Tính toán tọa độ cx, cy mới cho chấm tròn chỉ báo
  const indicatorCx = indicatorOrbitRadius * Math.cos(currentAngleRad);
  const indicatorCy = indicatorOrbitRadius * Math.sin(currentAngleRad);

  return (
    <svg
      viewBox="0 0 100 100" // viewBox cố định để các tọa độ trong path hoạt động đúng
      width={size}
      height={size}
      className={cn("progress-ring", className)} // Thêm className từ props
    >
      <defs>
        <clipPath id={clipPathId}>
          {/* Path gốc cho clipPath: d="M3.06...e-15,-50 L2.57...e-15,-42Z".
            Như đã thảo luận, tọa độ này (-50, -42) rất lớn so với bán kính của chấm tròn (r=4).
            Nếu clipPathUnits là 'userSpaceOnUse' (mặc định), nó sẽ cắt một vùng rất xa tâm chấm tròn,
            có thể khiến chấm tròn bị ẩn. Bạn có thể cần điều chỉnh thuộc tính 'd' này 
            (ví dụ: d="M0,-2 L0,2 Z" nếu muốn cắt 1 lát từ tâm chấm tròn) 
            hoặc xóa clipPath nếu không cần thiết.
          */}
          <path d="M3.061616997868383e-15,-50L2.5717582782094417e-15,-42Z"></path>
        </clipPath>
      </defs>
      <g transform="translate(50, 50)">
        {" "}
        {/* Dịch chuyển gốc tọa độ vào tâm (50,50) của viewBox 100x100 */}
        {/* Vòng nền */}
        <path
          d="M3.061616997868383e-15,-50A50,50,0,1,1,-3.061616997868383e-15,50A50,50,0,1,1,3.061616997868383e-15,-50M-7.715274834628325e-15,-42A42,42,0,1,0,7.715274834628325e-15,42A42,42,0,1,0,-7.715274834628325e-15,-42Z"
          fill={trackColor}
        ></path>
        {/* Path tĩnh (có trong SVG gốc) */}
        <path
          d="M3.061616997868383e-15,-50L2.5717582782094417e-15,-42Z"
          fill={staticPathColor}
        ></path>
        {/* Chấm tròn chỉ báo tiến trình (di chuyển) */}
        <circle
          clipPath={`url(#${clipPathId})`}
          cx={indicatorCx}
          cy={indicatorCy}
          fill={indicatorColor}
          r={indicatorRadius}
        ></circle>
      </g>
    </svg>
  );
};

ProgressRing.propTypes = {
  progress: PropTypes.number,
  size: PropTypes.number,
  trackColor: PropTypes.string,
  indicatorColor: PropTypes.string,
  staticPathColor: PropTypes.string,
  indicatorRadius: PropTypes.number,
  className: PropTypes.string,
};

export default ProgressRing;
