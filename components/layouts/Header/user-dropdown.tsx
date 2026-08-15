"use client";

import { useMemo, useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Profile } from "@/types/user";
import { cn } from "@/utils";

type UserDropdownProps = {
  initialUser: SupabaseUser & Pick<Profile, "proficiency_level">;
};

export function UserDropdown({ initialUser }: UserDropdownProps) {
  const supabase = useMemo(() => createClient(), []);

  const [notificationCount, setNotificationCount] = useState(3);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  // useEffect(() => {
  //   setUser(initialUser);
  // }, [initialUser]);

  // useEffect(() => {
  //   const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null);
  //   });

  //   return () => {
  //     subscription.subscription.unsubscribe();
  //   };
  // }, [supabase]);

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  const levelStyles: Record<string, string> = {
    beginner:
      "border-green-500 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    intermediate:
      "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    advanced:
      "border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-black"
                onClick={clearNotifications}
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            <DropdownMenuItem className="flex flex-col items-start py-2">
              <div className="font-medium">Mission Update</div>
              <div className="text-sm text-muted-foreground">
                Proxima Centauri mission reached 80% completion
              </div>
              <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-2">
              <div className="font-medium">New Research Published</div>
              <div className="text-sm text-muted-foreground">
                &quot;Quantum Entanglement in Deep Space&quot; has been published
              </div>
              <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-2">
              <div className="font-medium">System Alert</div>
              <div className="text-sm text-muted-foreground">
                Scheduled maintenance will occur on April 15th at 02:00 UTC
              </div>
              <div className="text-xs text-muted-foreground mt-1">3 days ago</div>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center justify-center text-primary">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      {initialUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={initialUser?.user_metadata?.avatar_url} alt="User" />
                <AvatarFallback>{(initialUser?.email?.[0] ?? "U").toUpperCase()}</AvatarFallback>
              </Avatar>

              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-2">
              <span>
                {initialUser?.user_metadata?.full_name || initialUser?.email || "My Account"}
              </span>
              {initialUser?.email ? (
                <span className="text-xs text-muted-foreground">{initialUser.email}</span>
              ) : null}

              <Badge
                variant="outline"
                className={cn(
                  "w-fit capitalize",
                  levelStyles[
                    initialUser.proficiency_level ? initialUser.proficiency_level : "Newbie"
                  ]
                )}
              >
                {initialUser.proficiency_level || "Newbie"}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} disabled={isSigningOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isSigningOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Skeleton className="rounded" />
      )}
    </div>
  );
}
