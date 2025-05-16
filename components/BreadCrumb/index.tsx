"use client";

import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className, ...props }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs = [
    {
      label: "Trang chủ",
      href: "/",
    },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      // Bạn có thể tùy chỉnh cách hiển thị label dựa trên segment
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return {
        label,
        href,
      };
    }),
  ];

  return (
    <ShadcnBreadcrumb className={cn(className)} {...props}>
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink asChild href={breadcrumb.href}>
            <Link href={breadcrumb.href} className="flex items-center gap-x-2">
              {index === 0 && <Home className="h-4 w-4" />}
              <span>{breadcrumb.label}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </ShadcnBreadcrumb>
  );
};

export default Breadcrumb;
