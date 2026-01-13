import React, { useState } from "react";
import { format } from "date-fns";
import {
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    Briefcase,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Zap,
    TrendingUp,
    ArrowRight,
} from "lucide-react";

// shadcn/ui Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Hooks
import { useAvailableJobs, useAcceptJob } from "@/Hooks/useBookings";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const JobCard = ({ job, onAccept, isProcessing, onViewDetails }) => {
    const scheduledDate = new Date(job.scheduled_at);
    const now = new Date();
    const hoursUntil = Math.floor((scheduledDate - now) / (1000 * 60 * 60));
    const minutesUntil = Math.floor(
        ((scheduledDate - now) % (1000 * 60 * 60)) / (1000 * 60)
    );

    let timeLabel = "";
    if (hoursUntil > 24) {
        timeLabel = `In ${Math.floor(hoursUntil / 24)} day${
            Math.floor(hoursUntil / 24) !== 1 ? "s" : ""
        }`;
    } else if (hoursUntil > 0) {
        timeLabel = `In ${hoursUntil}h ${minutesUntil}m`;
    } else {
        timeLabel = "Starting soon";
    }

    return (
        <Card className="group border-primary/20 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Top Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/20"></div>

            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <Badge
                            variant="outline"
                            className="capitalize font-medium text-xs"
                        >
                            {job.service_type || "Standard Clean"}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                            Earning
                        </p>
                        <p className="text-2xl font-bold text-primary">
                            {formatCurrency(job.total_price)}
                        </p>
                    </div>
                </div>

                <CardTitle className="text-xl text-foreground line-clamp-1">
                    {job.address?.city || "Unknown Location"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    <Zap className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                    {timeLabel}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-4 space-y-4">
                {/* Date & Time */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                Date
                            </p>
                            <p className="font-semibold text-foreground text-sm">
                                {format(scheduledDate, "EEE, MMM d")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                Time
                            </p>
                            <p className="font-semibold text-foreground text-sm">
                                {format(scheduledDate, "h:mm a")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                                Address
                            </p>
                            <p className="font-medium text-foreground line-clamp-2 text-sm">
                                {job.address?.street_address}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {job.address?.city}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Footer with Action */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-r from-slate-50/50 dark:from-slate-900/50 to-transparent space-y-3">
                <Button
                    onClick={() => onAccept(job.id)}
                    disabled={isProcessing}
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold rounded-lg group/btn disabled:opacity-70"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Securing...
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4 mr-2" />
                            Accept Job
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                        </>
                    )}
                </Button>

                <Button
                    onClick={() => onViewDetails(job.id)}
                    variant="outline"
                    className="w-full h-10 rounded-lg font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 group/detail"
                >
                    View Full Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/detail:translate-x-0.5 transition-transform" />
                </Button>

                <p className="text-xs text-muted-foreground text-center font-medium">
                    Secure this now before it's gone
                </p>
            </div>
        </Card>
    );
};

const EmptyState = () => (
    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 dark:from-slate-900/30 to-slate-100/30 dark:to-slate-900/10 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
                No Jobs Available Right Now
            </h3>

            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Don't worry! New job opportunities are posted constantly. Check
                back in a few minutes or stay online to receive instant
                notifications.
            </p>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 w-full max-w-sm">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 text-left">
                    Stay online for instant notifications!
                </p>
            </div>
        </CardContent>
    </Card>
);

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
                        <EmptyState />
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
