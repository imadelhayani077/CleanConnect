import { format, isToday, isTomorrow } from "date-fns";
import {
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Zap,
    ArrowRight,
    Trophy,
    Navigation,
    Phone,
    FileText,
    Award,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default function ScheduleJobCard({ job, onComplete, isCompleting }) {
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
            />

            {/* Status Badge */}
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
                {/* Date & Time */}
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

                {/* Client Info */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 dark:from-slate-800/60 to-slate-100/50 dark:to-slate-900/30 border border-slate-200 dark:border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Client Info
                        </p>
                        <Award className="w-4 h-4 text-primary" />
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
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

                {/* Notes */}
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
}
