import React from "react";
import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard"; // <--- Import the hook
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    CalendarClock,
    Star,
    DollarSign,
    Power,
    MapPin,
    AlertCircle,
    Loader2,
    Clock,
    User,
    ArrowRight,
} from "lucide-react";
import { useToggleAvailability } from "@/Hooks/useSweepstar";
import DisabledOverlay from "../auth/DisabledOverlay";
export default function SweepstarDashboard() {
    const { data: user } = useUser();
    const navigate = useNavigate();

    // 1. Fetch Real Data
    const { sweepstarStats, isSweepstarLoading } = useDashboard();
    const { mutate: toggleAvailability, isPending: isToggling } =
        useToggleAvailability();
    // 3. Get Status from Backend (Default to false if loading)
    const isAvailable = sweepstarStats?.data?.is_available ?? false;

    // Helper: Currency Formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    // Helper: Date Formatter
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    if (isSweepstarLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    // ADD THIS CHECK AT THE TOP OF THE RETURN
    if (user?.status === "disabled") {
        return <DisabledOverlay />;
    }

    const upcomingJobs = sweepstarStats?.upcoming_jobs || [];
    const stats = sweepstarStats?.data.stats || { completed: 0, earnings: 0 };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Availability Status Card */}

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-6 rounded-xl border border-border bg-card shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        My Workspace{" "}
                        <Briefcase className="w-6 h-6 text-primary" />
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Hello {user?.name}, ready to earn today?
                    </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border">
                    <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                            Worker Status
                        </p>
                        <p
                            className={`text-xs font-semibold ${
                                isAvailable
                                    ? "text-green-500"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {isAvailable ? "● Online & Visible" : "○ Offline"}
                        </p>
                    </div>

                    <button
                        onClick={() => toggleAvailability()}
                        disabled={isToggling} // Disable while saving
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            isAvailable
                                ? "bg-green-500"
                                : "bg-muted-foreground/30"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                isAvailable ? "translate-x-7" : "translate-x-1"
                            }`}
                        >
                            {/* Show Loader if Toggling, else Show Power Icon */}
                            {isToggling ? (
                                <Loader2 className="w-4 h-4 animate-spin text-primary absolute top-1 left-1" />
                            ) : (
                                <Power
                                    className={`w-4 h-4 absolute top-1 left-1 ${
                                        isAvailable
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                />
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* 2. Performance Stats Grid (REAL DATA) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Completed Jobs */}
                <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Jobs Completed
                        </p>
                        <p className="text-3xl font-bold text-foreground mt-1">
                            {stats.completed}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                </div>

                {/* Rating (Static for now, or fetch from profile if available) */}
                <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            My Rating
                        </p>
                        <p className="text-3xl font-bold text-yellow-500 mt-1">
                            {user?.sweepstar_profile?.rating || "5.0"}
                        </p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>

                {/* Total Earnings */}
                <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Total Earnings
                        </p>
                        <p className="text-3xl font-bold text-green-500 mt-1">
                            {formatCurrency(stats.earnings)}
                        </p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>

            {/* 3. Upcoming Jobs Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <CalendarClock className="w-5 h-5" />
                        Upcoming Schedule
                    </h2>
                    <button
                        onClick={() => navigate("/dashboard/schedule")}
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        View Full Calendar
                    </button>
                </div>

                {/* Conditional Rendering: List vs Empty State */}
                {upcomingJobs.length > 0 ? (
                    <div className="grid gap-4">
                        {upcomingJobs.slice(0, 3).map((job) => (
                            <div
                                key={job.id}
                                className="group p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <Clock className="w-4 h-4" />
                                        {formatDate(job.scheduled_at)}
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        {job.user?.name || "Client"}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {job.address?.city},{" "}
                                        {job.address?.street_address}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="font-bold text-foreground">
                                            {formatCurrency(job.total_price)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {job.duration_hours} Hours
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            navigate("/dashboard/schedule")
                                        }
                                        className="p-2 rounded-full bg-muted group-hover:bg-primary group-hover:text-white transition-colors"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State Card */
                    <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-card/50 text-center">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <MapPin className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                            No jobs assigned yet
                        </h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Turn on your availability status to start receiving
                            job offers in your area.
                        </p>
                        {!isAvailable && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-yellow-600 bg-yellow-500/10 px-3 py-1 rounded-full">
                                <AlertCircle className="w-4 h-4" />
                                You are currently offline
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
