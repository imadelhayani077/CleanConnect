import React from "react";
import { Bell, Check } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/Hooks/useNotifications";

// Note: If you don't have ScrollArea installed, just use a <div className="max-h-64 overflow-y-auto">

export default function NotificationBell() {
    const { notifications = [], markRead } = useNotifications();

    // Count how many are unread (read_at is null)
    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-center text-muted-foreground">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <DropdownMenuItem
                                key={notif.id}
                                onClick={() => markRead(notif.id)}
                                className={`cursor-pointer flex flex-col items-start gap-1 p-3 border-b border-border/40 ${
                                    !notif.read_at ? "bg-muted/50" : ""
                                }`}
                            >
                                <div className="flex justify-between w-full">
                                    <span
                                        className={`text-sm ${
                                            !notif.read_at ? "font-bold" : ""
                                        }`}
                                    >
                                        {notif.data.message}
                                    </span>
                                    {!notif.read_at && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(
                                        notif.created_at
                                    ).toLocaleString()}
                                </span>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
