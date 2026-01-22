// src/components/MissionPastCard.jsx
import { format } from "date-fns";
import {
    MapPin,
    Clock,
    Trophy,
    XCircle,
    Navigation,
    Phone,
    FileText,
    Award,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MissionHistoryCard({ job }) {
    const scheduledDate = new Date(job.scheduled_at);
    const isCompleted = job.status === "completed";

    return (
        <Card
            className={`group relative overflow-hidden border transition-all ${
                isCompleted
                    ? "border-green-200/70 bg-gradient-to-br from-green-50/40 to-transparent dark:from-green-950/20"
                    : "border-red-200/70 bg-gradient-to-br from-red-50/30 to-transparent dark:from-red-950/15 opacity-90"
            }`}
        >
            <div
                className={`h-1.5 bg-gradient-to-r ${
                    isCompleted
                        ? "from-green-500 to-green-400"
                        : "from-red-500 to-red-400"
                }`}
            />

            <div className="absolute top-4 right-4">
                <Badge
                    className={`text-xs px-3 py-1 rounded-full shadow font-medium ${
                        isCompleted
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                    }`}
                >
                    {isCompleted ? <>✓ Completed</> : <>Cancelled</>}
                </Badge>
            </div>

            <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-muted/50">
                        {isCompleted ? (
                            <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                    </div>
                    <div>
                        <Badge variant="outline" className="mb-1.5 text-xs">
                            {job.service_type || "Cleaning Mission"}
                        </Badge>
                        <CardTitle className="text-lg md:text-xl line-clamp-1">
                            {job.address?.city || "Location"}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.address?.street_address || "—"}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Date & Time – simpler */}
                <div className="grid grid-cols-3 gap-3 opacity-90">
                    <div className="p-3 rounded-lg bg-muted/40 border text-center">
                        <p className="text-xs uppercase font-bold text-muted-foreground">
                            {format(scheduledDate, "MMM")}
                        </p>
                        <p className="text-xl font-bold">
                            {format(scheduledDate, "d")}
                        </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-muted/30 border">
                            <p className="text-xs uppercase text-muted-foreground font-semibold">
                                {format(scheduledDate, "EEEE")}
                            </p>
                            <p className="text-sm">
                                {format(scheduledDate, "MMMM d, yyyy")}
                            </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/30 border flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                                {format(scheduledDate, "h:mm a")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Client info – simpler */}
                <div className="p-4 rounded-xl bg-muted/20 border space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                        Client
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
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

                {/* Notes if exist */}
                {job.notes && (
                    <div className="p-4 rounded-xl bg-muted/20 border">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                            Note
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            "{job.notes}"
                        </p>
                    </div>
                )}

                {/* Quick links – no complete action */}
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

            {/* Footer label instead of button */}
            <div className="border-t p-4 text-center text-sm font-medium bg-muted/10">
                {isCompleted ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Mission completed successfully
                    </span>
                ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Mission was cancelled
                    </span>
                )}
            </div>
        </Card>
    );
}
