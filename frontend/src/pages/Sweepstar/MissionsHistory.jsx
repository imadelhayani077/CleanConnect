import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trophy, Sparkles, Zap } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useCompleteMission, useMissionsHistory } from "@/Hooks/useBookings";
import MissionHistoryCard from "./components/MissionHistoryCard";
import EmptyMissionsState from "./components/EmptyMissionsState";

export default function MissionsHistory() {
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
                            Loading your schedule...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Syncing your upcoming jobs
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const completedCount = jobs.filter(
        (job) => job.status === "completed"
    ).length;
    const upcomingCount = jobs.filter(
        (job) => job.status !== "completed"
    ).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header with Stats */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Missions History
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base mt-1">
                                {jobs.length === 0
                                    ? "No jobs scheduled"
                                    : `${upcomingCount} upcoming ${
                                          upcomingCount === 1 ? "job" : "jobs"
                                      } • ${completedCount} completed`}
                            </p>
                        </div>
                    </div>

                    {jobs.length > 0 && (
                        <Badge className="w-fit text-base px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/95 hover:to-primary transition-all rounded-full font-semibold">
                            <Trophy className="w-4 h-4 mr-1.5" />
                            {completedCount} Completed
                        </Badge>
                    )}
                </div>

                {/* Progress Alert */}
                {jobs.length > 0 && completedCount > 0 && (
                    <Alert className="border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20">
                        <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-900 dark:text-green-300 font-semibold">
                            Amazing Progress! 🚀
                        </AlertTitle>
                        <AlertDescription className="text-green-800 dark:text-green-400 mt-1">
                            You've completed {completedCount} mission
                            {completedCount !== 1 ? "s" : ""}. Keep up the
                            momentum to boost your ratings!
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyMissionsState
                            onFindJobs={() => navigate("/dashboard/available")}
                        />
                    </div>
                ) : (
                    jobs.map((job) => (
                        <MissionHistoryCard
                            key={job.id}
                            job={job}
                            onComplete={handleComplete}
                            isCompleting={completingId === job.id && isPending}
                        />
                    ))
                )}
            </div>

            {/* Motivational Footer */}
            {upcomingCount > 0 && (
                <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-foreground font-semibold">
                        Ready to Earn More? 💪
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground mt-2">
                        Complete your {upcomingCount} upcoming job
                        {upcomingCount !== 1 ? "s" : ""} and check back for more
                        opportunities. Every completed job builds your
                        reputation!
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
