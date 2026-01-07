import React from "react";
import { format } from "date-fns";
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

// UI Components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// --- HOOKS (Single Source of Truth) ---
import { useCompleteJob, useMySchedule } from "@/Hooks/useBookings";

export default function MySchedule() {
    const navigate = useNavigate();

    // 1. Fetch Data
    const { data: jobs = [], isLoading } = useMySchedule();
    const { mutateAsync: completeJob, isPending } = useCompleteJob();

    const handleComplete = async (id) => {
        if (window.confirm("Are you sure you have finished this job?")) {
            await completeJob(id);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flexitems-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Syncing your calendar...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in p-6 fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    My Upcoming Schedule
                    <Badge variant="secondary" className="ml-2">
                        {jobs.length}
                    </Badge>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/30">
                        <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">
                            Your schedule is clear
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            You have no upcoming jobs assigned to you.
                        </p>
                        <Button
                            onClick={() =>
                                navigate("/dashboard?tab=available-jobs")
                            }
                        >
                            Find Available Jobs
                        </Button>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500 bg-card"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-1">
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                        {job.service_type || "Service"}
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-transparent">
                                        Confirmed
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg line-clamp-1">
                                    {job.address?.city || "Location Pending"}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">
                                        {job.address?.street_address}
                                    </span>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Date & Time Block */}
                                <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-lg border">
                                    <div className="flex flex-col items-center justify-center bg-background border rounded px-3 py-1 min-w-[60px]">
                                        <span className="text-xs font-bold text-red-500 uppercase">
                                            {format(
                                                new Date(job.scheduled_at),
                                                "MMM"
                                            )}
                                        </span>
                                        <span className="text-xl font-bold">
                                            {format(
                                                new Date(job.scheduled_at),
                                                "d"
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {format(
                                                new Date(job.scheduled_at),
                                                "EEEE"
                                            )}
                                        </span>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5 mr-1" />
                                            {format(
                                                new Date(job.scheduled_at),
                                                "p"
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                {job.notes && (
                                    <div className="flex items-start gap-2 bg-yellow-50 text-yellow-900 p-3 rounded-md text-sm border border-yellow-200">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-600" />
                                        <p className="italic">"{job.notes}"</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                {job.status === "confirmed" && (
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleComplete(job.id)}
                                        disabled={isPending}
                                    >
                                        {isPending
                                            ? "Updating..."
                                            : "Mark as Completed"}
                                    </Button>
                                )}
                                {job.status === "completed" && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-green-600 border-green-200 bg-green-50"
                                        disabled
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Job Completed
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
