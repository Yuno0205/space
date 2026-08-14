import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

import { ThemeProvider } from "@/components/shared/Theme/theme-provider";

import { cn } from "@/utils";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/layouts/Sidebar/main-sidebar";
import { ThemeToggle } from "@/components/shared/Theme/theme-toggle";
import { UserDropdown } from "@/components/layouts/Header/user-dropdown";
import Breadcrumb from "@/components/shared/BreadCrumb";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space | Personal Workspace of Yuno",
  description:
    "Discover the mysteries of space through immersive experiences, cutting-edge research, and breathtaking imagery.",
};

export const revalidate = 86400;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  // Get user from auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not login yet
  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  // Not onboarded yet
  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

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
                </div>
                <div className="flex-1" />

                <ThemeToggle />
                <UserDropdown initialUser={user} />
              </header>
              <main className="flex-grow container mx-auto px-4 py-8">
                <Breadcrumb className="mb-4" />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
