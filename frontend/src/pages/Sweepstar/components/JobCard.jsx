// src/components/jobs/JobCard.jsx
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

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);

export default function JobCard({
    job,
    onAccept,
    isProcessing,
    onViewDetails,
}) {
    const scheduledDate = new Date(job.scheduled_at);
    const now = new Date();
    const hoursUntil = Math.floor((scheduledDate - now) / (1000 * 60 * 60));
    const minutesUntil = Math.floor(
        ((scheduledDate - now) % (1000 * 60 * 60)) / (1000 * 60)
    );

    let timeLabel = "";
    if (hoursUntil > 24) {
        const days = Math.floor(hoursUntil / 24);
        timeLabel = `In ${days} day${days !== 1 ? "s" : ""}`;
    } else if (hoursUntil > 0) {
        timeLabel = `In ${hoursUntil}h ${minutesUntil}m`;
    } else {
        timeLabel = "Starting soon";
    }

    return (
        <Card className="group border-primary/20 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />

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

            {/* Footer with Actions */}
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
}
