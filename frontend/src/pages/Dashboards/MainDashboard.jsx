import React, { useState } from "react";
import { useClientContext } from "@/Helper/ClientContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import SweepstarDashboard from "./SweepstarDashboard";
import ClientDashboard from "./ClientDashboard";
import Sidebar from "@/layout/NavBar/SideBar";

export default function MainDashboard() {
    const { user, authenticated, loading } = useClientContext();
    const [activePage, setActivePage] = useState("dashboard");

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

    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    // --- LOGIC TO SWITCH DASHBOARDS ---
    const renderDashboardByRole = () => {
        // 1. ADMIN PAGES

        switch (user.role) {
            case "admin":
                return <AdminDashboard activePage={activePage} />;
            case "sweepstar":
                return <SweepstarDashboard activePage={activePage} />;
            case "user":
            default:
                return <ClientDashboard activePage={activePage} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* The Sidebar is consistent, content changes */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <main className="flex-1 text-foreground overflow-y-auto h-screen p-4">
                {renderDashboardByRole()}
            </main>
        </div>
    );
}
