"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Home,
  ImageIcon,
  LayoutDashboard,
  Rocket,
  Search,
  BookText,
  FileText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Navigation data
const navigationItems = [
  {
    title: "Trang chủ",
    icon: Home,
    href: "/",
    items: [],
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    items: [],
  },
  {
    title: "Tiếng Anh",
    icon: BookOpen,
    href: "/english",
    items: [
      { title: "Tổng quan", href: "/english" },
      { title: "Luyện nghe", href: "/english/listening" },
      { title: "Luyện nói", href: "/english/speaking" },
      { title: "Luyện đọc", href: "/english/reading" },
      { title: "Luyện viết", href: "/english/writing" },
      { title: "Từ vựng", href: "/english/vocabulary" },
    ],
  },
  {
    title: "Blog",
    icon: FileText,
    href: "/blog",
    items: [],
  },
  {
    title: "Khóa học",
    icon: BookText,
    href: "/courses",
    items: [
      { title: "Đang học", href: "/courses/current" },
      { title: "Đã hoàn thành", href: "/courses/completed" },
      { title: "Khám phá", href: "/courses/explore" },
    ],
  },
  {
    title: "Dự án",
    icon: Rocket,
    href: "/projects",
    items: [
      { title: "Đang thực hiện", href: "/projects/current" },
      { title: "Ý tưởng", href: "/projects/ideas" },
      { title: "Đã hoàn thành", href: "/projects/completed" },
    ],
  },
  {
    title: "Tài liệu",
    icon: ImageIcon,
    href: "/resources",
    items: [
      { title: "Bài viết", href: "/resources/articles" },
      { title: "Video", href: "/resources/videos" },
      { title: "Sách", href: "/resources/books" },
      { title: "Mã nguồn", href: "/resources/code" },
    ],
  },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-full bg-background pl-8 text-sm"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            {section.items.length > 0 ? (
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === item.href}
                                className={cn(
                                  "transition-colors",
                                  pathname === item.href
                                    ? "font-medium text-white"
                                    : "text-muted-foreground hover:text-white"
                                )}
                              >
                                <Link href={item.href}>{item.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
                <SidebarGroupLabel>
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    <span>{section.title}</span>
                  </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === section.href}
                        className={cn(
                          "transition-colors",
                          pathname === section.href
                            ? "font-medium text-white"
                            : "text-muted-foreground hover:text-white"
                        )}
                      >
                        <Link href={section.href}>{section.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
