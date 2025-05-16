"use client";
import {
  BookOpen,
  BookText,
  ChevronDown,
  FileText,
  Home,
  LayoutDashboard,
  Rocket,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

// Navigation data
const navigationItems = [
  {
    title: "Home",
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
    title: "English",
    icon: BookOpen,
    href: "/english",
    items: [
      { title: "Overview", href: "/english" },
      { title: "Vocabulary", href: "/english/vocabulary" },
      { title: "Talk with EVI", href: "/english/dialogue" },
      { title: "Speaking Practice", href: "/english/speaking" },
      { title: "Listening Practice", href: "/english/listening" },
      { title: "Reading Practice", href: "/english/reading" },
      { title: "Writing Practice", href: "/english/writing" },
      { title: "Review", href: "/english/revise" },
    ],
  },
  {
    title: "Blog",
    icon: FileText,
    href: "/blog",
    items: [],
  },
  {
    title: "Courses",
    icon: BookText,
    href: "/courses",
    items: [
      { title: "In Progress", href: "/courses/current" },
      { title: "Completed", href: "/courses/completed" },
      { title: "Explore", href: "/courses/explore" },
    ],
  },
  {
    title: "Projects",
    icon: Rocket,
    href: "/projects",
    items: [
      { title: "In Progress", href: "/projects/current" },
      { title: "Ideas", href: "/projects/ideas" },
      { title: "Completed", href: "/projects/completed" },
    ],
  },
  // {
  //   title: "Tài liệu",
  //   icon: ImageIcon,
  //   href: "/resources",
  //   items: [
  //     { title: "Bài viết", href: "/resources/articles" },
  //     { title: "Video", href: "/resources/videos" },
  //     { title: "Sách", href: "/resources/books" },
  //     { title: "Mã nguồn", href: "/resources/code" },
  //   ],
  // },
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
                                    : "text-muted-foreground dark:hover:text-white hover:text-gray-900 "
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
                            : "text-muted-foreground dark:hover:text-white hover:text-gray-900"
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
