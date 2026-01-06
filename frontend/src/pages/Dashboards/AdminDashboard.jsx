// src/layout/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
    Users,
    Star,
    Calendar,
    DollarSign,
    TrendingUp,
    Download,
    Activity,
} from "lucide-react";
import { useUser } from "@/Hooks/useAuth";

/*===============================
  Reusable Stat Card
===============================*/

/*===============================
Admin Dashboard
===============================*/
export default function AdminDashboard({ activePage }) {
    const { data: user } = useUser();

    const [stats, setStats] = useState({
        total_users: 0,
        total_sweepstars: 0,
        active_bookings: 0,
        revenue: 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({
                total_users: 142,
                total_sweepstars: 28,
                active_bookings: 12,
                revenue: 12450,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        colorClass,
        description,
    }) => (
        <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            {description}
                        </p>
                    )}
                </div>

                {/* Icon instead of solid color square */}
                <div
                    className={`p-3 rounded-lg bg-opacity-10 flex items-center justify-center ${colorClass}`}
                >
                    <Icon className="w-5 h-5 text-current" />
                </div>
            </div>
        </div>
    );
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Admin Overview
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user?.name || "Admin"}
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Download Report
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Clients"
                    value={stats.total_users}
                    icon={Users}
                    colorClass="bg-blue-500 text-blue-600"
                    description="+12% from last month"
                />
                <StatCard
                    title="Sweepstars"
                    value={stats.total_sweepstars}
                    icon={Star}
                    colorClass="bg-purple-500 text-purple-600"
                    description="+2 new applications"
                />
                <StatCard
                    title="Active Bookings"
                    value={stats.active_bookings}
                    icon={Calendar}
                    colorClass="bg-orange-500 text-orange-600"
                    description="4 pending approval"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-green-500 text-green-600"
                    description="+8% this week"
                />
            </div>

            {/* Secondary widgets */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity */}
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">
                            Recent Activity
                        </h3>
                    </div>
                    <div className="h-40 flex items-center justify-center text-sm text-muted-foreground border-t border-border border-dashed">
                        No recent system alerts.
                    </div>
                </div>

                {/* System Status */}
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">
                        System Status
                    </h3>
                    <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
