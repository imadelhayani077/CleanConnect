// =====================================================
// src/components/NotificationBell.jsx
// =====================================================
import React, { useState } from "react";
import {
    Bell,
    CheckCheck,
    Loader2,
    Inbox,
    AlertCircle,
    CheckCircle2,
    Info,
    Clock,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/Hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { NotificationHandlers } from "./NotificationRoutes";

const getNotificationIcon = (type) => {
    switch (type) {
        case "booking":
            return (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            );
        case "alert":
            return (
                <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            );
        case "info":
            return <Info className="w-3.5 h-3.5 text-primary" />;
        default:
            return <Bell className="w-3.5 h-3.5 text-muted-foreground" />;
    }
};

const getNotificationColor = (type) => {
    switch (type) {
        case "booking":
            return "from-blue-50 dark:from-blue-900/20 to-blue-100/50 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/50";
        case "alert":
            return "from-red-50 dark:from-red-900/20 to-red-100/50 dark:to-red-900/10 border-red-200/50 dark:border-red-800/50";
        case "info":
            return "from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20 dark:border-primary/30";
        default:
            return "from-slate-50 dark:from-slate-800/50 to-slate-100/50 dark:to-slate-900/30 border-slate-200/50 dark:border-slate-800/50";
    }
};

const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
};

export default function NotificationBell() {
    const {
        notifications = [],
        markRead,
        markAllRead,
        isLoading,
    } = useNotifications();
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const unreadCount = notifications.filter((n) => !n.read_at).length;
    const navigate = useNavigate();

    const handleNotificationClick = (notif) => {
        const handler = NotificationHandlers[notif.data.type];
        markRead(notif.id);
        if (handler) handler(navigate, notif.data);
        else navigate("/dashboard");
    };

    const handleMarkAllAsRead = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMarkingAll(true);
        try {
            if (markAllRead) {
                await markAllRead();
            }
        } finally {
            setIsMarkingAll(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-lg hover:bg-primary/10 transition-all duration-200"
                >
                    <div className="relative">
                        <Bell className="h-4.5 w-4.5 text-foreground hover:text-primary transition-colors" />
                        {unreadCount > 0 && (
                            <>
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 dark:bg-red-600 border-2 border-white dark:border-slate-900 animate-pulse shadow-sm" />
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 dark:bg-red-600 opacity-30 blur-sm animate-pulse" />
                            </>
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 max-w-[90vw] max-h-[70vh] p-0 border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50 border-b border-slate-200 dark:border-slate-800 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className="p-1.5 rounded-md bg-primary/10">
                                <Bell className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">
                                    Notifications
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {unreadCount} unread
                                </p>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                disabled={isMarkingAll}
                                className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10 gap-1 transition-all"
                            >
                                {isMarkingAll ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span className="sr-only">
                                            Marking...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCheck className="h-3 w-3" />
                                        <span className="sr-only">
                                            Mark all
                                        </span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[calc(70vh-120px)] divide-y divide-slate-200 dark:divide-slate-800">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center space-y-2">
                                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                                <p className="text-xs text-muted-foreground">
                                    Loading notifications...
                                </p>
                            </div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-6 text-center">
                            <div className="inline-flex p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-2 mx-auto">
                                <Inbox className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="font-medium text-sm text-foreground mb-1">
                                All caught up!
                            </p>
                            <p className="text-xs text-muted-foreground">
                                No notifications right now
                            </p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <DropdownMenuItem
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`cursor-pointer flex gap-2.5 p-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                    !notif.read_at
                                        ? "bg-gradient-to-r " +
                                          getNotificationColor(
                                              notif.data.type,
                                          ) +
                                          " border-l-3 border-primary"
                                        : "bg-white dark:bg-transparent"
                                }`}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    {getNotificationIcon(notif.data.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 py-0.5">
                                    <div className="flex items-start justify-between gap-1.5 mb-0.5">
                                        <p
                                            className={`text-sm font-medium text-foreground leading-tight truncate ${
                                                !notif.read_at
                                                    ? "font-semibold"
                                                    : ""
                                            }`}
                                        >
                                            {notif.data.message}
                                        </p>
                                        {!notif.read_at && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0 mt-1.5" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-1.5">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            {formatTimeAgo(notif.created_at)}
                                        </span>

                                        {!notif.read_at && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-1.5 py-0.5 h-auto"
                                            >
                                                New
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="sticky bottom-0 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50 border-t border-slate-200 dark:border-slate-800 p-2.5 text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/dashboard/notifications")}
                            className="w-full text-xs font-medium text-primary hover:bg-primary/10 h-8"
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
