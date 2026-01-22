// src/pages/dashboards/AdminDashboard.jsx
import React from "react";
import { Activity, Download } from "lucide-react";

import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard";

import { Button } from "@/components/ui/button";
import StatCard from "./components/StatCard";
import RecentActivity from "./components/RecentActivity";
import SystemStatus from "./components/SystemStatus";
import { Users, Star, Calendar, DollarSign } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const { data: user } = useUser();
    const { adminStats, isAdminLoading } = useDashboard();

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);

    if (isAdminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back,{" "}
                        <span className="font-semibold text-foreground">
                            {user?.name || "Admin"}
                        </span>
                    </p>
                </div>
                <Button className="rounded-lg gap-2 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg h-10 px-6 font-semibold">
                    <Download className="w-4 h-4" />
                    Download Report
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Clients"
                    value={adminStats?.data.total_clients || 0}
                    icon={Users}
                    colorClass="bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    description="Active accounts"
                />
                <StatCard
                    title="Total Sweepstars"
                    value={adminStats?.data.total_sweepstars || 0}
                    icon={Star}
                    colorClass="bg-purple-500/20 text-purple-600 dark:text-purple-400"
                    description="Verified workers"
                />
                <StatCard
                    title="Active Bookings"
                    value={adminStats?.data.active_bookings || 0}
                    icon={Calendar}
                    colorClass="bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    description="Pending or confirmed"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(adminStats?.data.revenue)}
                    icon={DollarSign}
                    colorClass="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    description="Completed jobs"
                />
            </div>

            {/* Secondary Widgets */}
            <div className="grid gap-6 md:grid-cols-3">
                <RecentActivity
                    recentActivity={adminStats?.data.recent_activity || []}
                    formatCurrency={formatCurrency}
                />
                <SystemStatus adminStats={adminStats} />
            </div>
        </div>
    );
}
