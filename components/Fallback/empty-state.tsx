// components/ui/empty-state.tsx
"use client";

import { Button, ButtonProps } from "@/components/ui/button"; // Import ButtonProps
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Inbox, LucideIcon, PackageOpen, PlusCircle, SearchX } from "lucide-react"; // Thêm các icon bạn có thể muốn dùng
import React from "react";

interface EmptyStateProps {
  icon?: LucideIcon; // Cho phép truyền icon tùy chỉnh
  title?: string;
  description?: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
  actionButtonProps?: ButtonProps; // Cho phép truyền các props của Button
  className?: string;
  children?: React.ReactNode; // Cho phép truyền nội dung tùy chỉnh thêm vào
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: IconComponent = PackageOpen, // Icon mặc định
  title = "Không có gì ở đây cả",
  description = "Có vẻ như chưa có dữ liệu nào được tạo hoặc tìm thấy.",
  actionButtonText,
  onActionButtonClick,
  actionButtonProps,
  className,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 border-2 border-dashed border-border rounded-lg bg-card/50", // Sử dụng màu từ theme
        className
      )}
    >
      <IconComponent
        className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground mb-6"
        strokeWidth={1.5}
      />
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6">{description}</p>
      {actionButtonText && onActionButtonClick && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          <Button onClick={onActionButtonClick} {...actionButtonProps}>
            {actionButtonProps?.leftIcon && <actionButtonProps.leftIcon className="mr-2 h-4 w-4" />}
            {actionButtonText}
          </Button>
        </motion.div>
      )}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
};

// Tạo một vài biến thể của EmptyState cho các trường hợp phổ biến
const EmptySearchState: React.FC<Omit<EmptyStateProps, "icon" | "title" | "description">> = (
  props
) => (
  <EmptyState
    icon={SearchX}
    title="Không tìm thấy kết quả"
    description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn."
    {...props}
  />
);

const EmptyContentState: React.FC<Omit<EmptyStateProps, "icon" | "title" | "description">> = (
  props
) => (
  <EmptyState
    icon={Inbox} // Hoặc FileText
    title="Chưa có nội dung"
    description="Hãy bắt đầu bằng cách tạo nội dung mới."
    actionButtonText={props.actionButtonText || "Tạo mới"}
    actionButtonProps={{
      leftIcon: PlusCircle, // Thêm icon cho button nếu muốn
      ...(props.actionButtonProps || {}),
    }}
    {...props}
  />
);

export { EmptyContentState, EmptySearchState, EmptyState };

// Mở rộng ButtonProps để có thể nhận leftIcon
declare module "@/components/ui/button" {
  interface ButtonProps {
    leftIcon?: LucideIcon;
  }
}
