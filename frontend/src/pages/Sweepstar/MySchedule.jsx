import React, { useState } from "react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Zap,
    ArrowRight,
    Trophy,
    Sparkles,
    Navigation,
    Phone,
    FileText,
    Award,
} from "lucide-react";

// shadcn/ui Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

// Hooks
import { useCompleteJob, useMySchedule } from "@/Hooks/useBookings";

const getJobStatus = (jobDate) => {
    const date = new Date(jobDate);
    if (isToday(date))
        return {
            label: "Today",
            color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
            icon: "🔥",
        };
    if (isTomorrow(date))
        return {
            label: "Tomorrow",
            color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
            icon: "⏰",
        };
    return {
        label: "Upcoming",
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        icon: "📅",
    };
};

const ScheduleJobCard = ({ job, onComplete, isCompleting }) => {
    const scheduledDate = new Date(job.scheduled_at);
    const status = getJobStatus(job.scheduled_at);
    const isCompleted = job.status === "completed";

    return (
        <Card
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-primary/20 ${
                isCompleted
                    ? "bg-gradient-to-br from-green-50/50 dark:from-green-900/20 to-transparent"
                    : "hover:border-primary/50"
            }`}
        >
            {/* Top Gradient Bar */}
            <div
                className={`h-1.5 bg-gradient-to-r ${
                    isCompleted
                        ? "from-green-500 via-green-400 to-green-300"
                        : "from-primary via-primary/60 to-primary/20"
                }`}
            ></div>

            {/* Status Badge - Floating */}
            <div className="absolute top-4 right-4 z-10">
                <Badge
                    className={`font-bold shadow-lg ${status.color} text-xs py-1 px-2.5 rounded-full`}
                >
                    <span className="mr-1.5">{status.icon}</span>
                    {isCompleted ? "✓ Completed" : status.label}
                </Badge>
            </div>

            <CardHeader className="pb-4">
                <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <Badge
                            variant="outline"
                            className="text-xs font-semibold capitalize mb-2"
                        >
                            {job.service_type || "Standard Cleaning"}
                        </Badge>
                        <CardTitle className="text-xl line-clamp-1">
                            {job.address?.city || "Location"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">
                                {job.address?.street_address}
                            </span>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-4 space-y-4">
                {/* Date & Time - Calendar Style */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 flex items-center justify-center p-3 rounded-lg bg-gradient-to-br from-red-100 dark:from-red-900/30 to-red-50 dark:to-red-900/20 border border-red-200 dark:border-red-800/50">
                        <div className="text-center">
                            <p className="text-xs font-bold uppercase text-red-600 dark:text-red-400">
                                {format(scheduledDate, "MMM")}
                            </p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {format(scheduledDate, "d")}
                            </p>
                        </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {format(scheduledDate, "EEEE")}
                            </p>
                            <p className="text-sm font-bold text-foreground">
                                {format(scheduledDate, "MMMM d, yyyy")}
                            </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                                {format(scheduledDate, "h:mm a")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Client Info Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 dark:from-slate-800/60 to-slate-100/50 dark:to-slate-900/30 border border-slate-200 dark:border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Client Info
                        </p>
                        <Award className="w-4 h-4 text-primary" />
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <p className="font-semibold text-foreground text-sm">
                                {job.user?.name || "Client Name"}
                            </p>
                        </div>
                        {job.user?.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm text-muted-foreground font-medium">
                                    {job.user.phone}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special Notes */}
                {job.notes && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 dark:from-amber-900/20 to-orange-50/50 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                Special Instructions
                            </p>
                        </div>
                        <p className="text-sm text-amber-900 dark:text-amber-200 italic font-medium leading-relaxed">
                            "{job.notes}"
                        </p>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-9 rounded-lg text-xs font-medium group/nav hover:border-primary/40"
                    >
                        <Navigation className="w-3.5 h-3.5 mr-1.5 group-hover/nav:translate-x-0.5 transition-transform" />
                        Directions
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-9 rounded-lg text-xs font-medium"
                    >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Details
                    </Button>
                </div>
            </CardContent>

            {/* Footer Action */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-r from-slate-50/50 dark:from-slate-900/50 to-transparent">
                {!isCompleted ? (
                    <Button
                        onClick={() => onComplete(job.id)}
                        disabled={isCompleting}
                        className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold rounded-lg group/complete"
                    >
                        {isCompleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Completing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Completed
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/complete:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        disabled
                        className="w-full h-11 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg opacity-90"
                    >
                        <Trophy className="w-4 h-4 mr-2" />
                        Job Completed! 🎉
                    </Button>
                )}
            </div>
        </Card>
    );
};

const EmptyScheduleState = ({ onFindJobs }) => (
    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 dark:from-slate-900/30 to-slate-100/30 dark:to-slate-900/10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

        <CardContent className="relative z-10 flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4 animate-bounce">
                <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
                Your Schedule is Clear ✨
            </h3>

            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                You don't have any upcoming jobs. Start your earning journey by
                accepting available opportunities!
            </p>

            <Button
                onClick={onFindJobs}
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg h-11 px-8 font-semibold rounded-lg group"
            >
                <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Find Available Jobs
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
        </CardContent>
    </Card>
);

export default function MySchedule() {
    const navigate = useNavigate();
    const { data: jobs = [], isLoading } = useMySchedule();
    const { mutateAsync: completeJob, isPending } = useCompleteJob();
    const [completingId, setCompletiingId] = useState(null);

    const handleComplete = async (id) => {
        if (window.confirm("Excellent work! Confirm this job is completed?")) {
            setCompletiingId(id);
            try {
                await completeJob(id);
            } finally {
                setCompletiingId(null);
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
                                My Schedule
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
                        <Badge className="w-fit text-base px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/95 hover:to-primary transition-all rounded-full font-semibold">
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
                            You've completed {completedCount} job
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
                        <EmptyScheduleState
                            onFindJobs={() => navigate("/dashboard/available")}
                        />
                    </div>
                ) : (
                    jobs.map((job) => (
                        <ScheduleJobCard
                            key={job.id}
                            job={job}
                            onComplete={handleComplete}
                            isCompleting={completingId === job.id}
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
