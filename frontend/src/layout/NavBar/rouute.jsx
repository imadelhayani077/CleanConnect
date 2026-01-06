// src/layout/Sidebar/Sidebar.jsx
import React, { useState } from "react";
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

export default function Sidebar() {
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser();
    const { mutateAsync: logoutUser } = useLogout();
    const [activePage, setActivePage] = useState("dashboard");

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
            { id: "myinfo", label: "My Info", icon: UserRoundCog },
            { id: "users", label: "All Users", icon: Users },
            { id: "bookings", label: "All Bookings", icon: Calendar },
            { id: "services", label: "All Services", icon: Wrench },
            { id: "applications", label: "Applications", icon: Settings },
        ],
        sweepstar: [
            { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
            { id: "myinfo", label: "My Info", icon: UserRoundCog },
            { id: "available", label: "My Jobs", icon: ListChecks },
            { id: "schedule", label: "My Schedule", icon: Calendar },
        ],
        client: [
            { id: "dashboard", label: "Home", icon: LayoutDashboard },
            { id: "myinfo", label: "My Info", icon: UserRoundCog },
            { id: "book-new", label: "Book Service", icon: PlusCircle },
            { id: "my-bookings", label: "History", icon: Briefcase },
            { id: "addresses", label: "My Addresses", icon: MapPin },
            { id: "becomSweep", label: "Become a Pro", icon: BrushCleaning },
        ],
    };

    const currentMenu = MENUS[role] || MENUS.client;

    const routeMap = {
        // shared
        dashboard: "/dashboard",
        myinfo: "/dashboard/my-info",

        // admin
        users: "/dashboard/users",
        bookings: "/dashboard/bookings",
        services: "/dashboard/services",
        applications: "/dashboard/applications",

        // sweepstar
        available: "/dashboard/available",
        schedule: "/dashboard/schedule",

        // client
        "book-new": "/dashboard/booking",
        "my-bookings": "/dashboard/booking-history",
        addresses: "/dashboard/address",
        becomSweep: "/dashboard/become-sweepstar",
    };

    const handleMenuClick = (id) => {
        setActivePage(id);
        const to = routeMap[id] || "/dashboard";
        navigate(to);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    const { bg, text, badge } = getRoleStyles(role);

    return (
        <aside className="flex h-full flex-col border-r bg-background">
            <div className={`p-4 ${bg} ${text}`}>
                <div className="font-semibold">{user?.name}</div>
                <div
                    className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${badge}`}
                >
                    {role}
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-2">
                {currentMenu.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleMenuClick(item.id)}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="border-t p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                </Button>
            </div>
        </aside>
    );
}
