"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

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

export function UserDropdown() {
  const [notificationCount, setNotificationCount] = useState(3);

  const clearNotifications = () => {
    setNotificationCount(0);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/assets/images/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium">User Name</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
