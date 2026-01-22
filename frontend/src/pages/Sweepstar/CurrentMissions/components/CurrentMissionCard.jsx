// src/components/MissionActiveCard.jsx
import { format, isToday, isTomorrow } from "date-fns";
import {
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Zap,
    ArrowRight,
    Navigation,
    Phone,
    FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getJobStatus = (jobDate) => {
    const date = new Date(jobDate);
    if (isToday(date))
        return {
            label: "Today",
            color: "bg-red-100 dark:bg-red-900/30 text-red-700",
            icon: "🔥",
        };
    if (isTomorrow(date))
        return {
            label: "Tomorrow",
            color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700",
            icon: "⏰",
        };
    return {
        label: "Upcoming",
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700",
        icon: "📅",
    };
};

export default function CurrentMissionCard({ job, onComplete, isCompleting }) {
    const scheduledDate = new Date(job.scheduled_at);
    const status = getJobStatus(job.scheduled_at);

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-xl border-primary/20 hover:border-primary/50">
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

            <div className="absolute top-4 right-4">
                <Badge
                    className={`shadow ${status.color} text-xs px-3 py-1 rounded-full font-medium`}
                >
                    {status.icon} {status.label}
                </Badge>
            </div>

            <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <Badge variant="outline" className="mb-1.5 text-xs">
                            {job.service_type || "Cleaning Mission"}
                        </Badge>
                        <CardTitle className="text-lg md:text-xl line-clamp-1">
                            {job.address?.city || "Mission Location"}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.address?.street_address || "—"}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5 pb-5">
                {/* Date & Time */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-200/50 text-center">
                        <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase">
                            {format(scheduledDate, "MMM")}
                        </p>
                        <p className="text-2xl font-bold text-red-800 dark:text-red-300">
                            {format(scheduledDate, "d")}
                        </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-muted/40 border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                                {format(scheduledDate, "EEEE")}
                            </p>
                            <p className="text-sm font-medium">
                                {format(scheduledDate, "MMMM d, yyyy")}
                            </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/40 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-sm">
                                {format(scheduledDate, "h:mm a")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Client */}
                <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Client
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-primary/70" />
                            <span className="font-medium">
                                {job.user?.name || "—"}
                            </span>
                        </div>
                        {job.user?.phone && (
                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                {job.user.phone}
                            </div>
                        )}
                    </div>
                </div>

                {job.notes && (
                    <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase mb-1.5">
                            Notes
                        </p>
                        <p className="text-sm italic text-amber-900/90 dark:text-amber-200/90">
                            "{job.notes}"
                        </p>
                    </div>
                )}

                {/* Quick actions */}
                <div className="flex gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                    >
                        <Navigation className="w-3.5 h-3.5 mr-1.5" />
                        Directions
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                    >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Details
                    </Button>
                </div>
            </CardContent>

            {/* Complete button */}
            <div className="border-t p-4 bg-gradient-to-r from-primary/5 to-primary/10">
                <Button
                    onClick={() => onComplete(job.id)}
                    disabled={isCompleting}
                    className="w-full font-semibold"
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
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
