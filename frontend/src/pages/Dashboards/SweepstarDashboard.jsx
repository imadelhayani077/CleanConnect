import React from "react";
import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    CalendarClock,
    Star,
    DollarSign,
    Loader2,
    Clock,
    User,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Activity,
    MapPin,
} from "lucide-react";
import { useToggleAvailability } from "@/Hooks/useSweepstar";

// shadcn/ui Components
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import DisabledOverlay from "../auth/DisabledOverlay";

const StatCard = ({ icon: Icon, label, value, subtext, color }) => {
    const colorClasses = {
        blue: "from-blue-50 dark:from-blue-950/30 to-blue-100/50 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50",
        yellow: "from-yellow-50 dark:from-yellow-950/30 to-yellow-100/50 dark:to-yellow-900/20 border-yellow-200/50 dark:border-yellow-800/50",
        green: "from-green-50 dark:from-green-950/30 to-green-100/50 dark:to-green-900/20 border-green-200/50 dark:border-green-800/50",
    };

    const iconClasses = {
        blue: "text-blue-600 dark:text-blue-400",
        yellow: "text-yellow-600 dark:text-yellow-400",
        green: "text-green-600 dark:text-green-400",
    };

    const valueClasses = {
        blue: "text-blue-700 dark:text-blue-300",
        yellow: "text-yellow-700 dark:text-yellow-300",
        green: "text-green-700 dark:text-green-300",
    };

    return (
        <Card
            className={`bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:scale-105`}
        >
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            {label}
                        </p>
                        <p
                            className={`text-4xl font-bold ${valueClasses[color]}`}
                        >
                            {value}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {subtext}
                        </p>
                    </div>
                    <div
                        className={`p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm`}
                    >
                        <Icon className={`w-6 h-6 ${iconClasses[color]}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function SweepstarDashboard() {
    const { data: user } = useUser();
    const navigate = useNavigate();
    const { sweepstarStats, isSweepstarLoading } = useDashboard();
    const { mutate: toggleAvailability, isPending: isToggling } =
        useToggleAvailability();

    const isAvailable = sweepstarStats?.data?.is_available ?? false;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

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
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground text-sm">
                        Loading your workspace...
                    </p>
                </div>
            </div>
        );
    }

    if (user?.status === "disabled") {
        return <DisabledOverlay />;
    }

    const upcomingJobs = sweepstarStats?.upcoming_jobs || [];
    const stats = sweepstarStats?.data.stats || { completed: 0, earnings: 0 };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 max-w-7xl mx-auto">
            {/* HERO SECTION WITH STATUS TOGGLE */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-primary/8 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent p-8 md:p-12">
                {/* Decorative Blobs */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-3xl dark:bg-primary/10"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl dark:bg-primary/5"></div>

                <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full mb-4 shadow-sm">
                                <Activity className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-primary">
                                    Sweepstar Worker
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                                Welcome back,{" "}
                                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    {user?.name?.split(" ")[0] || "Worker"}
                                </span>
                                ! 🎉
                            </h1>

                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                {isAvailable
                                    ? "You're online and ready to receive job offers. Keep up the great work!"
                                    : "Go online to start receiving job opportunities in your area."}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {stats.completed} jobs completed
                                </span>
                                <span className="text-slate-400 dark:text-slate-600">
                                    •
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {user?.sweepstar_profile?.rating || "5.0"}{" "}
                                    rating
                                </span>
                            </div>
                        </div>

                        {/* Right - Status Toggle Card */}
                        <div className="flex justify-center md:justify-end">
                            <Card className="w-full max-w-sm shadow-xl border-primary/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                                <CardContent className="pt-8 space-y-6">
                                    {/* Status Display */}
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Worker Status
                                        </p>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                            <div
                                                className={`w-3 h-3 rounded-full animate-pulse ${
                                                    isAvailable
                                                        ? "bg-green-500"
                                                        : "bg-slate-400"
                                                }`}
                                            ></div>
                                            <span
                                                className={`font-semibold ${
                                                    isAvailable
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-slate-600 dark:text-slate-400"
                                                }`}
                                            >
                                                {isAvailable
                                                    ? "Online & Visible"
                                                    : "Offline"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Toggle Button */}
                                    <Button
                                        onClick={() => toggleAvailability()}
                                        disabled={isToggling}
                                        className={`w-full h-12 font-semibold text-base rounded-xl transition-all duration-300 ${
                                            isAvailable
                                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                                : "bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 hover:from-slate-400 hover:to-slate-500 text-slate-900 dark:text-white"
                                        }`}
                                    >
                                        {isToggling ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : isAvailable ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Go Offline
                                            </>
                                        ) : (
                                            <>
                                                <Activity className="w-4 h-4 mr-2" />
                                                Go Online
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                                        {isAvailable
                                            ? "You will receive job notifications"
                                            : "Activate to receive nearby job offers"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Briefcase}
                    label="Jobs Completed"
                    value={stats.completed}
                    subtext="Total successful cleanings"
                    color="blue"
                />
                <StatCard
                    icon={Star}
                    label="Your Rating"
                    value={user?.sweepstar_profile?.rating || "5.0"}
                    subtext="★ Excellent performance"
                    color="yellow"
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Earnings"
                    value={formatCurrency(stats.earnings)}
                    subtext="From completed jobs"
                    color="green"
                />
            </div>

            {/* UPCOMING JOBS SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <CalendarClock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">
                                Upcoming Jobs
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {upcomingJobs.length} scheduled session
                                {upcomingJobs.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    {upcomingJobs.length > 0 && (
                        <Button
                            onClick={() => navigate("/dashboard/schedule")}
                            variant="outline"
                            className="gap-2"
                        >
                            View Calendar
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Jobs List */}
                {upcomingJobs.length > 0 ? (
                    <div className="space-y-3">
                        {upcomingJobs.slice(0, 4).map((job, idx) => (
                            <Card
                                key={job.id}
                                className="group border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-6 p-6">
                                        {/* Job Counter */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary">
                                                {idx + 1}
                                            </div>
                                        </div>

                                        {/* Job Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                                <span className="font-semibold text-foreground text-sm">
                                                    {formatDate(
                                                        job.scheduled_at
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                <span className="font-medium text-foreground">
                                                    {job.user?.name || "Client"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground truncate">
                                                    {
                                                        job.address
                                                            ?.street_address
                                                    }
                                                    , {job.address?.city}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price & Duration */}
                                        <div className="flex-shrink-0 text-right hidden md:block border-l border-slate-200 dark:border-slate-700 pl-6">
                                            <p className="text-2xl font-bold text-primary">
                                                {formatCurrency(
                                                    job.total_price
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {job.duration_hours} hour
                                                {job.duration_hours !== 1
                                                    ? "s"
                                                    : ""}
                                            </p>
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            onClick={() =>
                                                navigate("/dashboard/schedule")
                                            }
                                            size="icon"
                                            variant="ghost"
                                            className="flex-shrink-0 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <CalendarClock className="w-8 h-8 text-muted-foreground" />
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                No Jobs Yet
                            </h3>

                            <p className="text-muted-foreground max-w-sm mb-6">
                                You don't have any upcoming jobs. Turn on your
                                availability status to start receiving offers
                                from nearby clients.
                            </p>

                            {!isAvailable && (
                                <Alert className="border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/80 dark:bg-yellow-900/20">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                    <AlertTitle className="text-yellow-900 dark:text-yellow-300 text-sm">
                                        You're Currently Offline
                                    </AlertTitle>
                                    <AlertDescription className="text-yellow-800 dark:text-yellow-400 text-xs mt-1">
                                        Activate your status above to start
                                        receiving job opportunities
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* MOTIVATIONAL ALERT */}
            {upcomingJobs.length > 0 && (
                <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-foreground font-semibold">
                        You're Doing Great! 🚀
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground mt-2">
                        You have {upcomingJobs.length} upcoming job
                        {upcomingJobs.length !== 1 ? "s" : ""}. Keep delivering
                        excellent service to increase your ratings and earn more
                        opportunities!
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
