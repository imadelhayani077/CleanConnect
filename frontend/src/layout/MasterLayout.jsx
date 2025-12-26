import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useClientContext } from "@/Helper/ClientContext";
import NavBar from "./NavBar/NavBar";
import SideBar from "./NavBar/SideBar";

export default function MasterLayout() {
    // We use 'loading' from context instead of local state
    const { authenticated, loading } = useClientContext();
    const location = useLocation();

    // 1. SHOW SKELETON WHILE CONTEXT CHECKS COOKIE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="skeleton-container w-full max-w-lg">
                    <div className="skeleton-line skeleton-line-medium w-1/3"></div>
                    <div className="skeleton-line skeleton-line-small w-full"></div>
                    <div className="skeleton-line skeleton-line-small w-5/6"></div>
                </div>
            </div>
        );
    }

    const isPublicPage = [
        "/",
        "/contact",
        "/about",
        "/login",
        "/signup",
    ].includes(location.pathname);

    const showDashboardLayout = authenticated && !isPublicPage;

    // 2. DASHBOARD LAYOUT
    if (showDashboardLayout) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <NavBar />
                <div className="flex pt-20 h-screen overflow-hidden">
                    <div className="hidden md:block sidebar">
                        <SideBar />
                    </div>
                    <main className="flex-1 overflow-auto p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    // 3. PUBLIC LAYOUT
    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />
            <main className="pt-20">
                <Outlet />
            </main>
        </div>
    );
}
