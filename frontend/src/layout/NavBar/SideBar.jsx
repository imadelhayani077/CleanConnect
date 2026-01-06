// src/layout/Sidebar/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useLogout } from "@/Hooks/useAuth";

import {
    LayoutDashboard,
    UserRoundCog,
    Users,
    Calendar,
    Briefcase,
    Settings,
    LogOut,
    PlusCircle,
    Wrench,
    BrushCleaning,
    MapPin,
    ListChecks,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRoleStyles } from "@/utils/roleStyles";

export default function Sidebar({ activePage, setActivePage }) {
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser();
    const { mutateAsync: logoutUser } = useLogout();

    const role = user?.role || "client";

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const MENUS = {
        admin: [
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "my-info", label: "My Info", icon: UserRoundCog },
            { id: "users", label: "All Users", icon: Users },
            { id: "bookings", label: "All Bookings", icon: Calendar },
            { id: "services", label: "All Services", icon: Wrench },
            { id: "Applications", label: "Applications", icon: Settings },
        ],
        sweepstar: [
            { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
            { id: "my-info", label: "My Info", icon: UserRoundCog },
            { id: "available", label: "My Jobs", icon: ListChecks },
            { id: "schedule", label: "My Schedule", icon: Calendar },
        ],
        client: [
            { id: "dashboard", label: "Home", icon: LayoutDashboard },
            { id: "my-info", label: "My Info", icon: UserRoundCog },
            { id: "book-new", label: "Book Service", icon: PlusCircle },
            { id: "my-bookings", label: "History", icon: Briefcase },
            { id: "addresses", label: "My Addresses", icon: MapPin },
            { id: "becomSweep", label: "Become a Pro", icon: BrushCleaning },
        ],
    };

    const currentMenu = MENUS[role] || MENUS.client;

    if (isLoading) {
        return (
            <div className="w-64 border-r border-border/60 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center pt-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <aside className="w-64 border-r border-border/60 bg-background/95 backdrop-blur-sm flex flex-col shadow-sm transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-border/60">
                <h2 className="text-lg font-bold flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                        {role.charAt(0).toUpperCase()}
                    </div>
                    <span>
                        Dash<span className="text-primary">Board</span>
                    </span>
                </h2>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-semibold">
                    {role} Panel
                </p>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {currentMenu.map((item) => {
                    const isActive = activePage === item.id;
                    const Icon = item.icon;

                    return (
                        <Button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:shadow-lg"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-accent-foreground"
                                }`}
                            />
                            <span className="truncate">{item.label}</span>
                        </Button>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-border/60 bg-muted/30">
                <div className="rounded-lg bg-background/60 border border-border/60 p-3 mb-3">
                    <p className="text-xs font-semibold text-foreground truncate">
                        {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user?.email || "no email"}
                    </p>
                    <div
                        className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${getRoleStyles(
                            user?.role
                        )}`}
                    >
                        {role}
                    </div>
                </div>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-destructive" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
