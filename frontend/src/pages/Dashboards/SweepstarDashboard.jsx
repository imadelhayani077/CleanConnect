import React, { useState } from "react";
import { useUser } from "@/Hooks/useAuth";
import {
    Briefcase,
    CalendarClock,
    Star,
    DollarSign,
    Power,
    MapPin,
    AlertCircle,
} from "lucide-react";

// Sub-components
import UserInfo from "@/pages/GeneralPages/UserInfo";
import AvailableJobs from "../Sweepstar/AvailableJobs";
import MySchedule from "../Sweepstar/MySchedule";

export default function SweepstarDashboard({ activePage }) {
    const { data: user } = useUser();
    const [isAvailable, setIsAvailable] = useState(true);

    const RenderContent = () => {
        switch (activePage) {
            case "available":
                return <AvailableJobs />;
            case "schedule":
                return <MySchedule />;
            case "my-info":
                return <UserInfo />;
            case "dashboard":
            default:
                return (
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. Availability Status Card */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-6 rounded-xl border border-border bg-card shadow-sm">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    My Workspace{" "}
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Hello {user?.name || "Sweepstar"}, ready to
                                    earn today?
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
                                        {isAvailable
                                            ? "● Online & Visible"
                                            : "○ Offline"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsAvailable(!isAvailable)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                        isAvailable
                                            ? "bg-green-500"
                                            : "bg-muted-foreground/30"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                            isAvailable
                                                ? "translate-x-7"
                                                : "translate-x-1"
                                        }`}
                                    >
                                        <Power
                                            className={`w-4 h-4 absolute top-1 left-1 ${
                                                isAvailable
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* 2. Performance Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Jobs Completed
                                    </p>
                                    <p className="text-3xl font-bold text-foreground mt-1">
                                        0
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>

                            <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        My Rating
                                    </p>
                                    <p className="text-3xl font-bold text-yellow-500 mt-1">
                                        5.0
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-500/10 rounded-lg">
                                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                </div>
                            </div>

                            <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Earnings (Week)
                                    </p>
                                    <p className="text-3xl font-bold text-green-500 mt-1">
                                        $0.00
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Upcoming Jobs / Empty State */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <CalendarClock className="w-5 h-5" />
                                    Upcoming Schedule
                                </h2>
                                <button className="text-sm text-primary hover:underline font-medium">
                                    View Calendar
                                </button>
                            </div>

                            {/* Empty State Card */}
                            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-card/50 text-center">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <MapPin className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    No jobs assigned yet
                                </h3>
                                <p className="text-muted-foreground mt-2 max-w-sm">
                                    Turn on your availability status to start
                                    receiving job offers in your area.
                                </p>
                                {!isAvailable && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-yellow-600 bg-yellow-500/10 px-3 py-1 rounded-full">
                                        <AlertCircle className="w-4 h-4" />
                                        You are currently offline
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };
    return <RenderContent />;
}
