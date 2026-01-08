// src/pages/dashboards/AdminDashboard.jsx
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
    CheckCircle2,
    XCircle,
    Database,
    Zap,
    AlertCircle,
} from "lucide-react";
import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

/*===============================
  Stat Card Component
===============================*/
const StatCard = ({ title, value, icon: Icon, colorClass, description }) => (
    <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold mt-2 text-foreground">
                        {value}
                    </h3>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`p-3 rounded-lg bg-opacity-10 flex items-center justify-center shrink-0 ${colorClass}`}
                >
                    <Icon className="w-5 h-5 text-current" />
                </div>
            </div>
        </CardContent>
    </Card>
);

/*===============================
  Admin Dashboard
===============================*/
export default function AdminDashboard() {
    const { data: user } = useUser();
    const { adminStats, isAdminLoading } = useDashboard();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

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
                <Button className="rounded-lg gap-2 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all h-10 px-6 font-semibold">
                    <Download className="w-4 h-4" />
                    Download Report
                </Button>
            </div>

            {/* Key Metrics Grid */}
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
                {/* Recent Activity */}
                <div className="md:col-span-2">
                    <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm h-full flex flex-col">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Activity className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            Recent Activity
                                        </CardTitle>
                                        <CardDescription className="mt-0.5">
                                            Latest bookings and transactions
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden flex flex-col pt-6">
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                {adminStats?.data.recent_activity &&
                                adminStats.data.recent_activity.length > 0 ? (
                                    adminStats.data.recent_activity.map(
                                        (booking) => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/20 hover:border-primary/30 hover:bg-muted/30 transition-all"
                                            >
                                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                                    <div
                                                        className={`mt-1 p-2 rounded-lg shrink-0 ${
                                                            booking.status ===
                                                            "completed"
                                                                ? "bg-emerald-100/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                                                : booking.status ===
                                                                  "cancelled"
                                                                ? "bg-red-100/60 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                                                : "bg-blue-100/60 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                        }`}
                                                    >
                                                        {booking.status ===
                                                        "completed" ? (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        ) : booking.status ===
                                                          "cancelled" ? (
                                                            <XCircle className="w-4 h-4" />
                                                        ) : (
                                                            <Clock className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-foreground truncate">
                                                            {booking.user
                                                                ?.name ||
                                                                "Unknown Client"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] capitalize"
                                                            >
                                                                {booking.status}
                                                            </Badge>
                                                            <span className="ml-1">
                                                                {formatDate(
                                                                    booking.created_at
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-4">
                                                    <p className="text-sm font-bold text-foreground">
                                                        {formatCurrency(
                                                            booking.total_price
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Status */}
                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm h-fit">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            System Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-4">
                        {/* Status Indicator */}
                        <Alert className="border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800/60 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <AlertDescription className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">
                                    All Systems Operational
                                </AlertDescription>
                            </div>
                        </Alert>

                        {/* Status Items */}
                        <div className="space-y-3">
                            {[
                                {
                                    label: "Database",
                                    value: "Connected",
                                    icon: Database,
                                    status: "connected",
                                },
                                {
                                    label: "API Latency",
                                    value: "24ms",
                                    icon: Zap,
                                    status: "good",
                                },
                                {
                                    label: "Last Backup",
                                    value: "2 hours ago",
                                    icon: Clock,
                                    status: "recent",
                                },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/30 transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {item.label}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs font-semibold ${
                                                item.status === "connected" ||
                                                item.status === "good" ||
                                                item.status === "recent"
                                                    ? "bg-emerald-100/60 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60"
                                                    : "bg-muted text-foreground"
                                            }`}
                                        >
                                            {item.value}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick Stats */}
                        <div className="pt-4 border-t border-border/60 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Quick Stats
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                    Uptime
                                </span>
                                <span className="text-xs font-semibold text-foreground">
                                    99.9%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                    Active Users
                                </span>
                                <span className="text-xs font-semibold text-foreground">
                                    {adminStats?.data.total_clients || 0}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
