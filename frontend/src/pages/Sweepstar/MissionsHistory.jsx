import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trophy, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useMissionsHistory } from "@/Hooks/useBookings";
import MissionHistoryCard from "./components/MissionHistoryCard";
import EmptyMissionsState from "./components/EmptyMissionsState";

export default function MissionsHistory() {
    const navigate = useNavigate();
    const { data: jobs = [], isLoading } = useMissionsHistory();

    // REMOVED: useCompleteMission hook
    // REMOVED: handleComplete function

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3">
                        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <div>
                        <p className="text-foreground font-semibold">
                            Loading your history...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Retrieving past records
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // FILTER: Completed or Cancelled only (Past)
    const pastJobs = jobs.filter(
        (job) => job.status === "completed" || job.status === "cancelled"
    );

    const completedCount = jobs.filter(
        (job) => job.status === "completed"
    ).length;
    // We keep this variable just for the header stats context
    const upcomingCount = jobs.filter(
        (job) => job.status !== "completed" && job.status !== "cancelled"
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
                                {pastJobs.length === 0
                                    ? "No history yet"
                                    : `${pastJobs.length} archived • ${completedCount} successful`}
                            </p>
                        </div>
                    </div>

                    {pastJobs.length > 0 && (
                        <Badge className="w-fit text-base px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:from-green-600 hover:to-green-700 transition-all rounded-full font-semibold">
                            <Trophy className="w-4 h-4 mr-1.5" />
                            {completedCount} Completed
                        </Badge>
                    )}
                </div>

                {/* Progress Alert */}
                {completedCount > 0 && (
                    <Alert className="border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20">
                        <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-900 dark:text-green-300 font-semibold">
                            Amazing Progress! 🚀
                        </AlertTitle>
                        <AlertDescription className="text-green-800 dark:text-green-400 mt-1">
                            You've successfully completed {completedCount}{" "}
                            mission
                            {completedCount !== 1 ? "s" : ""}.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Jobs Grid - PAST ONLY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastJobs.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyMissionsState
                            onFindJobs={() => navigate("/dashboard/available")}
                        />
                    </div>
                ) : (
                    pastJobs.map((job) => (
                        <MissionHistoryCard
                            key={job.id}
                            job={job}
                            // REMOVED: onComplete and isCompleting props
                            // This ensures the button logic is effectively gone from the UI logic
                        />
                    ))
                )}
            </div>

            {/* REMOVED: Motivational Footer regarding upcoming jobs */}
        </div>
    );
}
