import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

import { UserDropdown } from "@/components/header/user-dropdown";
import { MainSidebar } from "@/components/sidebar/main-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space Explorer | Journey Through the Cosmos",
  description:
    "Discover the mysteries of space through immersive experiences, cutting-edge research, and breathtaking imagery.",
  generator: "v0.dev",
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
              <main>{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
