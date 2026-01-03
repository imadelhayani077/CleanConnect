// src/layout/NavBar/Sidebar.jsx
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
    Loader,
} from "lucide-react";

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
            <div className="sidebar flex flex-col items-center pt-10">
                <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="sidebar flex flex-col shadow-sm transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center text-sm font-bold shadow-sm">
                        {role.charAt(0).toUpperCase()}
                    </div>
                    <span>
                        Dash<span className="text-primary">Board</span>
                    </span>
                </h1>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider ml-1 font-semibold">
                    {role} Panel
                </p>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {currentMenu.map((item) => {
                    const isActive = activePage === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 transition-colors ${
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-accent-foreground"
                                }`}
                            />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Footer / logout */}
            <div className="p-4 border-t border-border mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-destructive" />
                    Logout
                </button>
            </div>
        </div>
    );
}
