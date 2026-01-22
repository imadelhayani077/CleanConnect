import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Loader2, TrendingUp, Award } from "lucide-react";
import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard";
import { useToggleAvailability } from "@/Hooks/useSweepstar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisabledOverlay from "@/pages/auth/DisabledOverlay";
import AvailabilityToggleCard from "./components/AvailabilityToggleCard";
import PerformanceStatsGrid from "./components/PerformanceStatsGrid";
import UpcomingMissionsSection from "./components/UpcomingMissionsSection";
import AchievementsSection from "./components/AchievementsSection";

export default function SweepstarDashboard() {
    const { data: user } = useUser();
    const navigate = useNavigate();
    const { sweepstarStats, isSweepstarLoading } = useDashboard();
    const { mutate: toggleAvailability, isPending: isToggling } =
        useToggleAvailability();
    const [activeTab, setActiveTab] = useState("overview");

    const isAvailable = sweepstarStats?.data?.is_available ?? false;
    const upcomingJobs = sweepstarStats?.upcoming_jobs || [];
    const stats = sweepstarStats?.data.stats || { completed: 0, earnings: 0 };
    const rating = user?.sweepstar_profile?.rating || 5.0;
    const ratingPercentage = (rating / 5.0) * 100;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    if (isSweepstarLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground text-base">
                        Loading your workspace...
                    </p>
                </div>
            </div>
        );
    }

    if (user?.status === "disabled") {
        return <DisabledOverlay />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent dark:from-primary/25 dark:via-primary/12 dark:to-transparent">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl dark:bg-primary/10 pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl dark:bg-primary/8 pointer-events-none"></div>
                <div className="relative z-10 p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 border border-primary/20 rounded-full shadow-lg backdrop-blur-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-bold text-primary">
                                    Sweepstar Pro ⚡
                                </span>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-5xl md:text-6xl font-black text-foreground leading-tight">
                                    Welcome,{" "}
                                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                                        {user?.name?.split(" ")[0] || "Worker"}
                                    </span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                                    {isAvailable
                                        ? "🎯 You're online and ready to take missions. Amazing work today!"
                                        : "🚀 Go online to start receiving amazing mission opportunities!"}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-black text-primary mt-1">
                                        {stats.completed}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                                        Rating
                                    </p>
                                    <p className="text-2xl font-black text-primary mt-1">
                                        {rating}★
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                                        Earned
                                    </p>
                                    <p className="text-xl font-black text-primary mt-1">
                                        {formatCurrency(stats.earnings)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <AvailabilityToggleCard
                                isAvailable={isAvailable}
                                isToggling={isToggling}
                                toggleAvailability={toggleAvailability}
                                navigate={navigate}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList className="grid w-full grid-cols-3 rounded-xl h-auto p-1 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger
                        value="overview"
                        className="rounded-lg text-sm font-semibold"
                    >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="missions"
                        className="rounded-lg text-sm font-semibold"
                    >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Missions
                    </TabsTrigger>
                    <TabsTrigger
                        value="achievements"
                        className="rounded-lg text-sm font-semibold"
                    >
                        <Award className="w-4 h-4 mr-2" />
                        Achievements
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <PerformanceStatsGrid
                        stats={stats}
                        upcomingJobs={upcomingJobs}
                        rating={rating}
                        formatCurrency={formatCurrency}
                    />
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/8 to-transparent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Performance Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold">
                                        Customer Rating
                                    </span>
                                    <span className="text-sm font-bold text-primary">
                                        {rating}/5.0
                                    </span>
                                </div>
                                <Progress
                                    value={ratingPercentage}
                                    className="h-3 rounded-full"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase">
                                        Response Time
                                    </p>
                                    <p className="text-2xl font-black text-primary mt-2">
                                        2 min
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase">
                                        Completion Rate
                                    </p>
                                    <p className="text-2xl font-black text-primary mt-2">
                                        98%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="missions" className="space-y-6 mt-6">
                    <UpcomingMissionsSection
                        upcomingJobs={upcomingJobs}
                        navigate={navigate}
                    />
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6 mt-6">
                    <AchievementsSection
                        stats={stats}
                        rating={rating}
                        earnings={stats.earnings}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
