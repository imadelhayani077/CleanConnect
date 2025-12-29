import React from "react";
import { useClientContext } from "@/Helper/ClientContext";
import {
    LayoutDashboard,
    UserRoundCog,
    Users,
    Calendar,
    Briefcase,
    Settings,
    LogOut,
    PlusCircle,
    MapPin,
    ListChecks,
} from "lucide-react";

export default function Sidebar({ activePage, setActivePage }) {
    const { user, logout } = useClientContext();
    const role = user?.role || "user";

    // --- CONFIGURATION ---
    const MENUS = {
        admin: [
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "my-info", label: "My Info", icon: UserRoundCog },
            { id: "users", label: "All Users", icon: Users },
            { id: "bookings", label: "All Bookings", icon: Calendar },
            { id: "settings", label: "System Settings", icon: Settings },
        ],
        sweepstar: [
            { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
            { id: "my-info", label: "My Info", icon: UserRoundCog },
            { id: "jobs", label: "My Jobs", icon: ListChecks },
            { id: "schedule", label: "My Schedule", icon: Calendar },
        ],
        client: [
            { id: "dashboard", label: "Home", icon: LayoutDashboard },
            { id: "my-info", label: "My Info", icon: UserRoundCog },
            { id: "book-new", label: "Book Service", icon: PlusCircle },
            { id: "my-bookings", label: "History", icon: Briefcase },
            { id: "addresses", label: "My Addresses", icon: MapPin },
        ],
    };

    const currentMenu = MENUS[role] || MENUS["client"];

    return (
        // Changed: bg-white -> bg-card, border-gray-200 -> border-border
        <div className="w-64 min-h-screen bg-card border-r border-border flex flex-col shadow-sm">
            {/* 1. Header Logo */}
            <div className="p-6 border-b border-border">
                {/* Changed: text-primary handles the color automatically */}
                <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
                    {/* Changed: bg-black -> bg-primary, text-white -> text-primary-foreground */}
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center text-sm font-bold">
                        {role.charAt(0).toUpperCase()}
                    </div>
                    <span>
                        Dash<span className="text-muted-foreground">Board</span>
                    </span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider ml-1">
                    {role} Panel
                </p>
            </div>

            {/* 2. Dynamic Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {currentMenu.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        // Changed: Hover and Active states use 'accent' and 'primary' variables
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activePage === item.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                        <item.icon
                            className={`w-5 h-5 ${
                                activePage === item.id
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground"
                            }`}
                        />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* 3. Footer / Logout */}
            {/* <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    // Changed: red-50 -> hover:bg-destructive/10, text-red-600 -> text-destructive
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div> */}
        </div>
    );
}
