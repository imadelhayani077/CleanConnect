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
} from "lucide-react";

// UI Components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- HOOKS (Single Source of Truth) ---
import { useAvailableJobs, useAcceptJob } from "@/Hooks/useBookings";

// Helper: Currency Formatter
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

export default function AvailableJobs() {
    // 1. Fetch Data (Auto-runs on mount)
    const { data: jobs = [], isLoading } = useAvailableJobs();

    // 2. Mutation Hook
    const { mutateAsync: acceptJob } = useAcceptJob();

    // Local state to track which specific button is spinning
    const [processingId, setProcessingId] = useState(null);

    // Inline feedback
    const [acceptError, setAcceptError] = useState(null);
    const [acceptSuccess, setAcceptSuccess] = useState(null);

    // Handler
    const handleAccept = async (jobId) => {
        setProcessingId(jobId);
        setAcceptError(null);
        setAcceptSuccess(null);

        try {
            await acceptJob(jobId);

            setAcceptSuccess("This job has been added to your schedule.");
            // List refresh is handled by query invalidation in the hook
        } catch (error) {
            console.error("Acceptance failed", error);
            setAcceptError(
                error?.response?.data?.message ||
                    "Could not accept job. It may have been taken."
            );
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Searching for nearby opportunities...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Available Opportunities
                    <Badge variant="secondary" className="ml-2">
                        {jobs.length}
                    </Badge>
                </h2>
            </div>

            {acceptError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{acceptError}</AlertDescription>
                </Alert>
            )}

            {acceptSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Job Accepted!</AlertTitle>
                    <AlertDescription>{acceptSuccess}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
                        <p className="text-muted-foreground font-medium">
                            No new jobs available right now.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Check back later! New requests come in hourly.
                        </p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 group"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {job.service_type || "Standard Clean"}
                                    </Badge>
                                    <span className="font-bold text-green-700 text-lg flex items-center bg-green-50 px-2 py-1 rounded-md">
                                        {formatCurrency(job.total_price)}
                                    </span>
                                </div>
                                <CardTitle className="text-lg mt-2 truncate">
                                    {job.address?.city || "Unknown Location"}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="text-sm space-y-3 text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">
                                        {format(
                                            new Date(job.scheduled_at),
                                            "PPP"
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>
                                        {format(
                                            new Date(job.scheduled_at),
                                            "p"
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                    <span className="line-clamp-2">
                                        {job.address?.street_address}
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                    onClick={() => handleAccept(job.id)}
                                    disabled={processingId !== null}
                                >
                                    {processingId === job.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Accepting...
                                        </>
                                    ) : (
                                        "Accept Job"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
