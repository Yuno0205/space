import type React from "react";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { MainSidebar } from "@/components/layouts/Sidebar/main-sidebar";
import { ThemeToggle } from "@/components/shared/Theme/theme-toggle";
import { UserDropdown } from "@/components/layouts/Header/user-dropdown";
import Breadcrumb from "@/components/shared/BreadCrumb";
import DailyGoals from "@/components/layouts/Header/daily-goals";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Check onboarding
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Failed to fetch profile:", profileError);

    throw new Error("Unable to load user profile");
  }

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const userData = { ...user, proficiency_level: profile.proficiency_level };

  return (
    <SidebarProvider defaultOpen={true}>
      <MainSidebar />

      <SidebarInset className="relative">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
          </div>

          <div className="flex-1" />

          <DailyGoals profile={profile} />

          <ThemeToggle />

          <UserDropdown initialUser={userData} />
        </header>

        <main className="container mx-auto flex-grow px-4 py-8">
          <Breadcrumb className="mb-4" />

          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
