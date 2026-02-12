// src/pages/jobs/AvailableMissions.jsx
import React, { useState } from "react";
import {
    Briefcase,
    Zap,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAvailableMissions, useAcceptMission } from "@/Hooks/useBookings";
import EmptyMissionsState from "./components/EmptyMissionsState";
import MissionCard from "./components/AvailableMissionCard";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// 1. IMPORT THE DETAIL MODAL
import MissionDetailModal from "./components/MissionDetailModal";

export default function AvailableMissions() {
    const { data: jobs = [], isLoading } = useAvailableMissions();
    const { mutateAsync: acceptMission } = useAcceptMission();

    const [processingId, setProcessingId] = useState(null);
    const [acceptError, setAcceptError] = useState(null);
    const [acceptSuccess, setAcceptSuccess] = useState(null);

    // 2. ADD STATE FOR SELECTED JOB DETAILS
    const [selectedJob, setSelectedJob] = useState(null);

    // Modal state for Accepting
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        jobId: null,
    });

    const handleAcceptClick = (jobId) => {
        setConfirmModal({
            open: true,
            jobId,
        });
    };

    const handleConfirmAccept = async () => {
        const jobId = confirmModal.jobId;
        if (!jobId) return;

        setProcessingId(jobId);
        setAcceptError(null);
        setAcceptSuccess(null);

        try {
            await acceptMission(jobId);
            setAcceptSuccess(
                "Congratulations! You've accepted this mission. Check your schedule for details.",
            );
            // Close modal only on success
            setConfirmModal({ open: false, jobId: null });
        } catch (error) {
            console.error("Acceptance failed", error);
            setAcceptError(
                error?.response?.data?.message ||
                    "Could not accept this job. It may have been taken by another worker.",
            );
            // Modal stays open so user can see the error and try again or cancel
        } finally {
            setProcessingId(null);
        }
    };

    // 3. IMPLEMENT THE VIEW DETAILS HANDLER
    const handleViewDetails = (jobId) => {
        const job = jobs.find((j) => j.id === jobId);
        if (job) {
            setSelectedJob(job);
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
                            Searching for Missions...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Finding missions near you
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Available Missions
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base mt-1">
                                {jobs.length === 0
                                    ? "Check back soon for new missions"
                                    : `${jobs.length} mission${jobs.length !== 1 ? "s" : ""} ready for you to grab`}
                            </p>
                        </div>
                    </div>

                    {jobs.length > 0 && (
                        <Badge className="w-fit text-base px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/95 hover:to-primary transition-all rounded-full font-semibold">
                            <Zap className="w-4 h-4 mr-1.5" />
                            {jobs.length} Live Mission
                            {jobs.length !== 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>

                {/* Motivational Alert */}
                {jobs.length > 0 && (
                    <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-foreground font-semibold">
                            Great Earning Missions Available! 🚀
                        </AlertTitle>
                        <AlertDescription className="text-muted-foreground mt-1">
                            Select missions that fit your schedule. Accept
                            quickly to boost your rating and earn more!
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Status Alerts (shown outside modal) */}
            {acceptSuccess && (
                <Alert className="border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-900 dark:text-green-300 font-semibold">
                        Mission Accepted! ✨
                    </AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-400 mt-2 text-sm">
                        {acceptSuccess}
                    </AlertDescription>
                </Alert>
            )}

            {acceptError && (
                <Alert
                    variant="destructive"
                    className="animate-in slide-in-from-top-2"
                >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{acceptError}</AlertDescription>
                </Alert>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyMissionsState />
                    </div>
                ) : (
                    jobs.map((job) => (
                        <MissionCard
                            key={job.id}
                            job={job}
                            onAccept={handleAcceptClick}
                            onViewDetails={handleViewDetails}
                            isProcessing={processingId === job.id}
                        />
                    ))
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal({ ...confirmModal, open: false })
                }
                onConfirm={handleConfirmAccept}
                title="Accept this Mission?"
                description="This will assign the mission to you. Make sure it fits your availability — accept only if you're ready to complete it."
                variant="default"
                confirmText="Yes, Accept Mission"
                cancelText="No, Cancel"
                isLoading={processingId === confirmModal.jobId}
            />

            {/* 4. RENDER THE DETAILS MODAL */}
            <MissionDetailModal
                open={!!selectedJob}
                booking={selectedJob}
                onClose={() => setSelectedJob(null)}
            />
        </div>
    );
}
