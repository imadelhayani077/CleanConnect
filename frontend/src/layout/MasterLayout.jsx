import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useClientContext } from "@/Helper/ClientContext";
import NavBar from "./NavBar/NavBar";
// import SideBar from "./NavBar/SideBar"; // <--- REMOVE THIS FROM HERE

export default function MasterLayout() {
    const { authenticated, loading } = useClientContext();
    const location = useLocation();

    // 1. Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="skeleton-container w-full max-w-lg">
                    {/* Skeleton Loading UI */}
                    <div className="skeleton-line skeleton-line-medium w-1/3"></div>
                    <div className="skeleton-line skeleton-line-small w-full"></div>
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

    // Only show "Dashboard Style" if logged in AND not on a public page
    const showDashboardLayout = authenticated && !isPublicPage;

    // 2. DASHBOARD LAYOUT (Logged In)
    if (showDashboardLayout) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <NavBar />

                {/* CRITICAL CHANGE:
                   We removed the fixed Sidebar here.
                   We let the <Outlet /> (MainDashboard) handle its own sidebar
                   because MainDashboard needs to pass props (activePage) to it.
                */}
                <div className="pt-20 h-screen overflow-hidden">
                    <main className="h-full w-full">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    // 3. PUBLIC LAYOUT (Guest)
    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />
            <main className="pt-20">
                <Outlet />
            </main>
        </div>
    );
}
