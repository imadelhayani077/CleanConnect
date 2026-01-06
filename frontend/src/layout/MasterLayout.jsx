// src/layout/MasterLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

import { useUser } from "@/Hooks/useAuth";

export default function MasterLayout() {
    const { data: user, isLoading } = useUser();
    const location = useLocation();
    const [activePage, setActivePage] = useState("dashboard");

    const isPublicPage = [
        "/",
        "/contact",
        "/about",
        "/login",
        "/signup",
    ].includes(location.pathname);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-full max-w-lg space-y-4">
                    <div className="h-12 bg-muted rounded-lg animate-pulse" />
                    <div className="h-32 bg-muted rounded-lg animate-pulse" />
                    <div className="h-32 bg-muted rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const isAuthenticated = !!user;
    const showDashboardLayout = isAuthenticated && !isPublicPage;

    // Public layout (no sidebar)
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <NavBar />
            <main className="flex-1 pt-4">
                <Outlet />
            </main>
        </div>
    );
}
