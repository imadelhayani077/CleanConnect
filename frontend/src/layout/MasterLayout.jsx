// src/layout/MasterLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import { useUser } from "@/Hooks/useAuth";

export default function MasterLayout() {
    const { data: user, isLoading } = useUser();
    const location = useLocation();

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
                <div className="skeleton-container w-full max-w-lg">
                    <div className="skeleton-line skeleton-line-small w-1/3" />
                    <div className="skeleton-line skeleton-line-small w-full" />
                </div>
            </div>
        );
    }

    const isAuthenticated = !!user;
    const showDashboardLayout = isAuthenticated && !isPublicPage;

    // Dashboard layout
    if (showDashboardLayout) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <NavBar />
                <div className="pt-16 h-screen overflow-hidden">
                    <main className="h-full w-full">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    // Public layout
    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />
            <main className="pt-16">
                <Outlet />
            </main>
        </div>
    );
}
