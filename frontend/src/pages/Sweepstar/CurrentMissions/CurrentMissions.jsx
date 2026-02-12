import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Zap, Sparkles, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useCompleteMission, useMissionsHistory } from "@/Hooks/useBookings";

import EmptyHistoryState from "../MissionsHistory/components/EmptyHistoryState";
import ConfirmationModal from "@/components/ui/ConfirmationModal"; // Modal
import CurrentMissionCard from "./components/CurrentMissionCard"; // Current Mission Card

export default function CurrentMissions() {
    const navigate = useNavigate();
    const { data: jobs = [], isLoading } = useMissionsHistory();
    const { mutateAsync: completeMission, isPending: isCompletingMission } =
        useCompleteMission();

    const [completingId, setCompletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        id: null,
    });

    const handleCompleteClick = (id) => {
        setConfirmModal({
            open: true,
            id: id,
        });
    };

    const handleConfirmComplete = async () => {
        const id = confirmModal.id;
        if (!id) return;

        setCompletingId(id); // Show loading state
        try {
            await completeMission(id);
            setConfirmModal({ open: false, id: null });
        } catch (error) {
            console.error("Failed to complete mission", error);
        } finally {
            setCompletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center space-y-5">
                    <Loader2 className="h-14 w-14 animate-spin text-primary mx-auto" />
                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            Loading missions...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1.5">
                            Syncing your current schedule
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const activeJobs = jobs.filter(
        (job) => job.status !== "completed" && job.status !== "cancelled",
    );

    const completedCount = jobs.filter(
        (job) => job.status === "completed",
    ).length;
    const upcomingCount = activeJobs.length;

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
                                Current Missions
                            </h1>
                            <p className="text-muted-foreground mt-1.5">
                                {upcomingCount === 0
                                    ? "No active missions right now"
                                    : `${upcomingCount} active mission${
                                          upcomingCount !== 1 ? "s" : ""
                                      } • ${completedCount} completed total`}
                            </p>
                        </div>
                    </div>

                    {upcomingCount > 0 && (
                        <Badge className="w-fit px-5 py-2.5 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-md">
                            <Zap className="w-4 h-4 mr-2" />
                            {upcomingCount} Active
                        </Badge>
                    )}
                </div>

                {upcomingCount > 0 && (
                    <Alert className="border-blue-200 bg-blue-50/70 dark:bg-blue-950/30 dark:border-blue-800/40 rounded-xl">
                        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <AlertTitle className="text-blue-900 dark:text-blue-300 font-semibold">
                            You're in demand! 🚀
                        </AlertTitle>
                        <AlertDescription className="text-blue-800 dark:text-blue-300 mt-1.5">
                            You have {upcomingCount} active mission
                            {upcomingCount !== 1 ? "s" : ""} to complete.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Content */}
            {activeJobs.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl">
                    <EmptyHistoryState
                        onFindJobs={() => navigate("/dashboard/available")}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeJobs.map((job) => (
                        <CurrentMissionCard
                            key={job.id}
                            job={job}
                            // Pass handler to complete the mission
                            onComplete={handleCompleteClick}
                            isCompleting={
                                completingId === job.id && isCompletingMission
                            }
                        />
                    ))}
                </div>
            )}

            {/* Motivational footer */}
            {upcomingCount > 0 && (
                <Alert className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl">
                    <Zap className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-semibold">
                        Keep the momentum going! 💪
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground mt-2">
                        Finish your {upcomingCount} upcoming mission
                        {upcomingCount !== 1 ? "s" : ""} to improve your stats
                        and earnings.
                    </AlertDescription>
                </Alert>
            )}

            {/* Render Confirmation Modal */}
            <ConfirmationModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal({ ...confirmModal, open: false })
                }
                onConfirm={handleConfirmComplete}
                title="Complete Mission?"
                description="Are you sure you want to mark this mission as completed? This will update your status and notify the client."
                variant="default" // Blue/primary as it's a positive action
                confirmText="Complete Mission"
                isLoading={isCompletingMission}
            />
        </div>
    );
}
