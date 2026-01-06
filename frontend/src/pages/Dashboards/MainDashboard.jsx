// src/pages/Dashboards/MainDashboard.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useUser } from "@/Hooks/useAuth";

import AdminDashboard from "./AdminDashboard";
import SweepstarDashboard from "./SweepstarDashboard";
import ClientDashboard from "./ClientDashboard";

export default function MainDashboard() {
    const { data: user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Content is Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case "admin":
            return <AdminDashboard />;
        case "sweepstar":
            return <SweepstarDashboard />;
        case "client":
        default:
            return <ClientDashboard />;
    }
}
