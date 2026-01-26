import { useState } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import {
    MapPin,
    Clock,
    CheckCircle2,
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

import MissionDetailModal from "../../AvailableMissions/components/MissionDetailModal";

const getJobStatus = (jobDate) => {
    const date = new Date(jobDate);
    if (isToday(date))
        return {
            label: "Today",
            color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
            icon: "🔥",
            border: "from-orange-500 via-orange-400 to-orange-300",
        };
    if (isTomorrow(date))
        return {
            label: "Tomorrow",
            color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
            icon: "⏰",
            border: "from-purple-500 via-purple-400 to-purple-300",
        };
    return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        icon: "📅",
        border: "from-blue-500 via-blue-400 to-blue-300",
    };
};

export default function CurrentMissionCard({ job, onComplete, isCompleting }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scheduledDate = new Date(job.scheduled_at);
    const status = getJobStatus(job.scheduled_at);

    const handleDirections = () => {
        if (job.address) {
            const query = `${job.address.street_address}, ${job.address.city}`;
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                "_blank",
            );
        }
    };

    return (
        <>
            <Card className="group relative overflow-hidden transition-all hover:shadow-xl border-primary/20 hover:border-primary/50 bg-card">
                {/* Dynamic Top Gradient */}
                <div className={`h-1.5 bg-gradient-to-r ${status.border}`} />

                <div className="absolute top-4 right-4">
                    <Badge className={`${status.color} shadow-sm border-0`}>
                        {status.icon} {status.label}
                    </Badge>
                </div>

                <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Zap className="w-5 h-5" />
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
                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                {format(scheduledDate, "MMM")}
                            </p>
                            <p className="text-xl font-bold text-foreground">
                                {format(scheduledDate, "d")}
                            </p>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border flex items-center justify-between">
                                <span className="text-xs uppercase text-muted-foreground font-bold">
                                    {format(scheduledDate, "EEEE")}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {format(scheduledDate, "yyyy")}
                                </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-2 text-primary">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                    {format(scheduledDate, "h:mm a")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={() => onComplete(job.id)}
                            disabled={isCompleting}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md"
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
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="px-3"
                        >
                            <FileText className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <MissionDetailModal
                booking={job}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
