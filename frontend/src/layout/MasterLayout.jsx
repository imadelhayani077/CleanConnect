// src/layout/MasterLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import Sidebar from "./NavBar/SideBar";
import { useUser } from "@/Hooks/useAuth";

export default function MasterLayout() {
    const { data: user, isLoading } = useUser();
    const location = useLocation();

    const isDashboard = location.pathname.startsWith("/dashboard");

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

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top navbar on all pages */}
            <NavBar user={user} />

            {isDashboard ? (
                // Dashboard layout: sidebar + main area
                <main className="flex flex-1">
                    <div className="w-64 border-r bg-muted">
                        <Sidebar />
                    </div>
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </main>
            ) : (
                // Non-dashboard pages: full width
                <main className="flex-1">
                    <Outlet />
                </main>
            )}
        </div>
    );
}
