"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // Đảm bảo đường dẫn đúng
import { Badge } from "@/components/ui/badge"; // Đảm bảo đường dẫn đúng

interface MissionCardProps {
  title: string;
  status: "Active" | "Preparing" | "Completed";
  // Bỏ 'progress' và thêm hai props mới
  completedTasks: number;
  totalTasks: number;
  description: string;
  delay?: number;
}

export function MissionCard({
  title,
  status,
  completedTasks, // Prop mới
  totalTasks, // Prop mới
  description,
  delay = 0,
}: MissionCardProps) {
  // Tính toán progress dựa trên completedTasks và totalTasks
  // Xử lý trường hợp totalTasks là 0 để tránh chia cho 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-xl font-bold capitalize">{title}</h3>
              <Badge
                variant={
                  status === "Active" ? "default" : status === "Preparing" ? "outline" : "secondary"
                }
                className={status === "Active" ? "bg-primary text-primary-foreground" : ""}
              >
                {status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{description}</p>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }} // Sử dụng progress đã tính toán
                viewport={{ once: true }}
                transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
                role="progressbar"
                aria-valuenow={progress} // Sử dụng progress đã tính toán
                aria-valuemin={0}
                aria-valuemax={100}
              ></motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1">
                {" "}
                {/* Giảm gap nếu cần */}
                <span className="text-xs text-muted-foreground">Progress:</span>
                <span className="text-xs text-muted-foreground font-medium">{completedTasks}</span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs text-muted-foreground font-medium">{totalTasks}</span>
                {/* Có thể thêm đơn vị nếu cần, ví dụ: " tasks" */}
              </div>
              <motion.span
                className="text-xs text-muted-foreground font-medium" // Thêm font-medium để đồng nhất
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay + 0.6 }}
              >
                {progress}% {/* Hiển thị progress đã tính toán */}
              </motion.span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
