import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

import { UserDropdown } from "@/components/Header/user-dropdown";
import { MainSidebar } from "@/components/Sidebar/main-sidebar";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/Theme/theme-toggle";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/BreadCrumb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space | Personal Workspace of Yuno",
  description:
    "Discover the mysteries of space through immersive experiences, cutting-edge research, and breathtaking imagery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SidebarProvider defaultOpen={true}>
            <MainSidebar />
            <SidebarInset className="relative">
              <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  {/* <Logo /> */}
                </div>
                <div className="flex-1" />

                <ThemeToggle />
                <UserDropdown />
              </header>
              <main className="flex-grow container mx-auto px-4 py-8">
                <Breadcrumb className="mb-4" />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
