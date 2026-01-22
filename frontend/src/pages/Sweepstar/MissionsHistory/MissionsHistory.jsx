// src/pages/sweepstar/MissionsHistory.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trophy, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useMissionsHistory } from "@/Hooks/useBookings";
import { Loader2 } from "lucide-react";

import MissionHistoryCard from "./components/MissionHistoryCard";
import EmptyMissionsState from "../components/EmptyMissionsState";

export default function MissionsHistory() {
    const navigate = useNavigate();
    const { data: jobs = [], isLoading } = useMissionsHistory();

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center space-y-5">
                    <Loader2 className="h-14 w-14 animate-spin text-primary mx-auto" />
                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            Loading history...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1.5">
                            Fetching your past missions
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const pastJobs = jobs.filter(
        (job) => job.status === "completed" || job.status === "cancelled",
    );

    const completedCount = jobs.filter(
        (job) => job.status === "completed",
    ).length;

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-primary/10">
                            <Calendar className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Missions History
                            </h1>
                            <p className="text-muted-foreground mt-1.5">
                                {pastJobs.length === 0
                                    ? "No past missions yet"
                                    : `${pastJobs.length} archived • ${completedCount} successful`}
                            </p>
                        </div>
                    </div>

                    {completedCount > 0 && (
                        <Badge className="w-fit px-5 py-2.5 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-md">
                            <Trophy className="w-4 h-4 mr-2" />
                            {completedCount} Completed
                        </Badge>
                    )}
                </div>

                {completedCount > 0 && (
                    <Alert className="border-green-200 bg-green-50/70 dark:bg-green-950/30 dark:border-green-800/40 rounded-xl">
                        <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-900 dark:text-green-300 font-semibold">
                            Great job! 🎉
                        </AlertTitle>
                        <AlertDescription className="text-green-800 dark:text-green-300 mt-1.5">
                            You've successfully completed {completedCount}{" "}
                            mission{completedCount !== 1 ? "s" : ""}.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastJobs.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyMissionsState
                            onFindJobs={() => navigate("/dashboard/available")}
                        />
                    </div>
                ) : (
                    pastJobs.map((job) => (
                        <MissionHistoryCard key={job.id} job={job} />
                    ))
                )}
            </div>
        </div>
    );
}
