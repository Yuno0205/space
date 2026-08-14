"use client";

import { useEffect, useMemo, useState } from "react";
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

export function UserDropdown() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isLoggedIn = Boolean(user);
  const appOrigin = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (fromEnv) return new URL(fromEnv).origin;
    return window.location.origin;
  }, []);

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setUser(null);
        return;
      }
      setUser(data.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appOrigin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setIsSigningOut(false);
    }
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
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
                <AvatarFallback>{(user?.email?.[0] ?? "U").toUpperCase()}</AvatarFallback>
              </Avatar>

              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>{user?.user_metadata?.full_name}</span>
              {user?.email ? (
                <span className="text-xs text-muted-foreground">{user.email}</span>
              ) : null}
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
        <Button
          variant="ghost"
          className="flex items-center gap-2 pl-2 pr-1"
          onClick={signInWithGoogle}
          disabled={isSigningIn}
        >
          {isSigningIn ? "Signing in..." : "Login with Google"}
        </Button>
      )}
    </div>
  );
}
