// src/pages/dashboards/SystemStatus.jsx
import React from "react";
import {
    AlertCircle,
    Clock,
    Users,
    Ticket,
    HardDrive,
    Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SystemStatus({ adminStats }) {
    // Example values — in real app these come from adminStats or separate query
    const pendingApplications = adminStats?.pending_applications || 12;
    const pendingTickets = adminStats?.pending_tickets || 5;
    const unverifiedSweepstars = adminStats?.unverified_sweepstars || 8;
    const diskUsagePercent = adminStats?.disk_usage_percent || 78;
    const hasCriticalAlert = pendingApplications > 10 || diskUsagePercent > 90;

    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm h-fit">
            <CardHeader className="border-b border-border/60 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Platform Health
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
                {/* Critical Alert (if any) */}
                {hasCriticalAlert && (
                    <Alert
                        variant="destructive"
                        className="rounded-lg border-red-400/60 bg-red-50/60 dark:bg-red-950/30"
                    >
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-semibold">
                            Action Required
                        </AlertTitle>
                        <AlertDescription className="text-sm mt-1">
                            {pendingApplications > 10 &&
                                `${pendingApplications} pending applications waiting review. `}
                            {diskUsagePercent > 90 &&
                                `Disk usage at ${diskUsagePercent}% — clean up soon.`}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Pending Tasks */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/30 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100/60 dark:bg-amber-900/30">
                                <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                            </div>
                            <span className="text-sm font-medium">
                                Pending Applications
                            </span>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-base font-semibold px-3 py-1"
                        >
                            {pendingApplications}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/30 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100/60 dark:bg-blue-900/30">
                                <Ticket className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-medium">
                                Open Support Tickets
                            </span>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-base font-semibold px-3 py-1"
                        >
                            {pendingTickets}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/30 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100/60 dark:bg-purple-900/30">
                                <Users className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                            </div>
                            <span className="text-sm font-medium">
                                Unverified Sweepstars
                            </span>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-base font-semibold px-3 py-1"
                        >
                            {unverifiedSweepstars}
                        </Badge>
                    </div>
                </div>

                {/* Storage / Uptime */}
                <div className="pt-4 border-t border-border/60 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <HardDrive className="w-4 h-4" />
                            Disk Usage
                        </span>
                        <span
                            className={`font-medium ${diskUsagePercent > 85 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}
                        >
                            {diskUsagePercent}%
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                            Uptime (30 days)
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            99.98%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
