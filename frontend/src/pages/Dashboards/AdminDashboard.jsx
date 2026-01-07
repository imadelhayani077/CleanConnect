// src/pages/Dashboards/AdminDashboard.jsx
import React from "react";
import {
    Users,
    Star,
    Calendar,
    DollarSign,
    TrendingUp,
    Download,
    Activity,
    Loader2,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard"; // <--- Import the Hook

/*===============================
  Reusable Stat Card
===============================*/
const StatCard = ({ title, value, icon: Icon, colorClass, description }) => (
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

            <div
                className={`p-3 rounded-lg bg-opacity-10 flex items-center justify-center ${colorClass}`}
            >
                <Icon className="w-5 h-5 text-current" />
            </div>
        </div>
    </div>
);

/*===============================
  Admin Dashboard
===============================*/
export default function AdminDashboard() {
    const { data: user } = useUser();

    // 1. Fetch Real Stats
    const { adminStats, isAdminLoading } = useDashboard();
    console.log(adminStats);

    // Helper: Currency Formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    // Helper: Date Formatter
    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    // 2. Loading State
    if (isAdminLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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

            {/* Key Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Clients"
                    value={adminStats?.data.total_clients || 0}
                    icon={Users}
                    colorClass="bg-blue-500 text-blue-600"
                    description="Registered accounts"
                />
                <StatCard
                    title="Total Sweepstars"
                    value={adminStats?.data.total_sweepstars || 0}
                    icon={Star}
                    colorClass="bg-purple-500 text-purple-600"
                    description="Verified workers"
                />
                <StatCard
                    title="Active Bookings"
                    value={adminStats?.data.active_bookings || 0}
                    icon={Calendar}
                    colorClass="bg-orange-500 text-orange-600"
                    description="Pending or Confirmed"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(adminStats?.data.revenue)}
                    icon={DollarSign}
                    colorClass="bg-green-500 text-green-600"
                    description="Completed jobs only"
                />
            </div>

            {/* Secondary Widgets */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity List */}
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">
                            Recent Activity
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {adminStats?.data.recent_activity &&
                        adminStats.data.recent_activity.length > 0 ? (
                            adminStats.data.recent_activity.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-1 p-1.5 rounded-full ${
                                                booking.status === "completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : booking.status ===
                                                      "cancelled"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {booking.status === "completed" ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : booking.status ===
                                              "cancelled" ? (
                                                <XCircle className="w-4 h-4" />
                                            ) : (
                                                <Clock className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {booking.user?.name ||
                                                    "Unknown Client"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    booking.status.slice(
                                                        1
                                                    )}{" "}
                                                •{" "}
                                                {formatDate(booking.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">
                                            {formatCurrency(
                                                booking.total_price
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-muted-foreground border-t border-border border-dashed">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-fit">
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

                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Database
                            </span>
                            <span className="text-green-600 font-medium">
                                Connected
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                API Latency
                            </span>
                            <span className="text-foreground font-medium">
                                24ms
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Last Backup
                            </span>
                            <span className="text-foreground font-medium">
                                2 hours ago
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
