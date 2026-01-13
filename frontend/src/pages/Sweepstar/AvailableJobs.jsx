// src/pages/jobs/AvailableJobs.jsx
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

import { useAvailableJobs, useAcceptJob } from "@/Hooks/useBookings";
import JobCard from "./components/JobCard";
import EmptyJobsState from "./components/EmptyJobsState";

export default function AvailableJobs() {
    const { data: jobs = [], isLoading } = useAvailableJobs();
    const { mutateAsync: acceptJob } = useAcceptJob();

    const [processingId, setProcessingId] = useState(null);
    const [acceptError, setAcceptError] = useState(null);
    const [acceptSuccess, setAcceptSuccess] = useState(null);

    const handleAccept = async (jobId) => {
        setProcessingId(jobId);
        setAcceptError(null);
        setAcceptSuccess(null);

        try {
            await acceptJob(jobId);
            setAcceptSuccess(
                "Congratulations! You've accepted this job. Check your schedule for details."
            );
        } catch (error) {
            console.error("Acceptance failed", error);
            setAcceptError(
                error?.response?.data?.message ||
                    "Could not accept this job. It may have been taken by another worker."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleViewDetails = (jobId) => {
        // TODO: Add your function here to handle view details
        console.log("View details for job:", jobId);
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
                            Searching for opportunities...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Finding jobs near you
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
                                Available Opportunities
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base mt-1">
                                {jobs.length === 0
                                    ? "Check back soon for new jobs"
                                    : `${jobs.length} job${
                                          jobs.length !== 1 ? "s" : ""
                                      } ready for you to grab`}
                            </p>
                        </div>
                    </div>

                    {jobs.length > 0 && (
                        <Badge className="w-fit text-base px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/95 hover:to-primary transition-all rounded-full font-semibold">
                            <Zap className="w-4 h-4 mr-1.5" />
                            {jobs.length} Live Job{jobs.length !== 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>

                {/* Motivational Alert */}
                {jobs.length > 0 && (
                    <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-foreground font-semibold">
                            Great Earning Opportunities Available! 🚀
                        </AlertTitle>
                        <AlertDescription className="text-muted-foreground mt-1">
                            Select jobs that fit your schedule. Accept quickly
                            to boost your rating and earn more!
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Status Alerts */}
            {acceptError && (
                <Alert
                    variant="destructive"
                    className="animate-in slide-in-from-top-2"
                >
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="font-semibold">
                        Could Not Accept Job
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-sm">
                        {acceptError}
                    </AlertDescription>
                </Alert>
            )}

            {acceptSuccess && (
                <Alert className="border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-900 dark:text-green-300 font-semibold">
                        Job Accepted! ✨
                    </AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-400 mt-2 text-sm">
                        {acceptSuccess}
                    </AlertDescription>
                </Alert>
            )}

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyJobsState />
                    </div>
                ) : (
                    jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onAccept={handleAccept}
                            onViewDetails={handleViewDetails}
                            isProcessing={processingId === job.id}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
