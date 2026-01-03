import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
// 1. Hooks
import { useUser } from "@/Hooks/useAuth";

// 2. Components
import Sidebar from "@/layout/NavBar/SideBar"; // Check this path matches your folder structure
import AdminDashboard from "./AdminDashboard";
import SweepstarDashboard from "./SweepstarDashboard";
import ClientDashboard from "./ClientDashboard";

export default function MainDashboard() {
    const { data: user, isLoading } = useUser();
    const [activePage, setActivePage] = useState("dashboard");

    // 3. Loading State
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // 4. Security Check
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 5. Role-Based Rendering Logic
    const renderDashboardByRole = () => {
        switch (user.role) {
            case "admin":
                return <AdminDashboard activePage={activePage} />;
            case "sweepstar":
                return <SweepstarDashboard activePage={activePage} />;
            case "client":
            case "user": // Handle both potential role names
            default:
                return <ClientDashboard activePage={activePage} />;
        }
    };

    return (
        <div className="flex h-full bg-background">
            {/* SIDEBAR LEFT
               - hidden md:block: Hides sidebar on mobile (assuming mobile users use the Navbar or a different menu)
               - h-full: Ensures it stretches to the bottom of the viewport
            */}
            <div className="hidden md:block h-full border-r border-border">
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
            </div>

            {/* MAIN CONTENT RIGHT
               - flex-1: Takes remaining width
               - overflow-y-auto: Handles scrolling for the dashboard content only (keeping sidebar fixed)
            */}
            <main className="flex-1 overflow-y-auto h-full p-4 md:p-8 bg-muted/10">
                <div className="max-w-6xl mx-auto">
                    {renderDashboardByRole()}
                </div>
            </main>
        </div>
    );
}
