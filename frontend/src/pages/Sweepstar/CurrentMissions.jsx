import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Zap, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useCompleteMission, useMissionsHistory } from "@/Hooks/useBookings";
import MissionHistoryCard from "./components/MissionHistoryCard";
import EmptyHistoryState from "./components/EmptyHistoryState";

export default function CurrentMissions() {
    const navigate = useNavigate();
    const { data: jobs = [], isLoading } = useMissionsHistory();
    const { mutateAsync: completeMission, isPending } = useCompleteMission();
    const [completingId, setCompletingId] = useState(null);

    const handleComplete = async (id) => {
        if (
            window.confirm("Excellent work! Confirm this mission is completed?")
        ) {
            setCompletingId(id);
            try {
                await completeMission(id);
            } finally {
                setCompletingId(null);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3">
                        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <div>
                        <p className="text-foreground font-semibold">
                            Loading your Missions...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Syncing your upcoming missions
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // FILTER: Active only
    const activeJobs = jobs.filter(
        (job) => job.status !== "completed" && job.status !== "cancelled"
    );

    // Context stats
    const completedCount = jobs.filter(
        (job) => job.status === "completed"
    ).length;
    const upcomingCount = activeJobs.length;

    return (
        // Added overflow-x-hidden to the main container to prevent any horizontal scroll
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
            {/* Header with Stats */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Current Schedule
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base mt-1">
                                {upcomingCount === 0
                                    ? "No active missions"
                                    : `${upcomingCount} active ${
                                          upcomingCount === 1
                                              ? "mission"
                                              : "missions"
                                      } • ${completedCount} completed total`}
                            </p>
                        </div>
                    </div>

                    {jobs.length > 0 && (
                        <Badge className="w-fit text-base px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/95 hover:to-primary transition-all rounded-full font-semibold">
                            <Zap className="w-4 h-4 mr-1.5" />
                            {upcomingCount} Active
                        </Badge>
                    )}
                </div>

                {/* Progress Alert */}
                {upcomingCount > 0 && (
                    <Alert className="border-blue-200 dark:border-blue-800/50 bg-blue-50/80 dark:bg-blue-900/20">
                        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle className="text-blue-900 dark:text-blue-300 font-semibold">
                            You are busy! 🚀
                        </AlertTitle>
                        <AlertDescription className="text-blue-800 dark:text-blue-400 mt-1">
                            You have {upcomingCount} active mission
                            {upcomingCount !== 1 ? "s" : ""} to complete.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* MAIN CONTENT AREA */}
            {activeJobs.length === 0 ? (
                // FIX: Wrapper with 'relative' and 'overflow-hidden' contains the blobs
                <div className="w-full relative overflow-hidden rounded-xl">
                    <EmptyHistoryState
                        onFindJobs={() => navigate("/dashboard/available")}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeJobs.map((job) => (
                        <MissionHistoryCard
                            key={job.id}
                            job={job}
                            onComplete={handleComplete}
                            isCompleting={completingId === job.id && isPending}
                        />
                    ))}
                </div>
            )}

            {/* Motivational Footer */}
            {upcomingCount > 0 && (
                <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-foreground font-semibold">
                        Keep up the Momentum 💪
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground mt-2">
                        Complete your {upcomingCount} upcoming mission
                        {upcomingCount !== 1 ? "s" : ""} to boost your earnings
                        and stats.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
