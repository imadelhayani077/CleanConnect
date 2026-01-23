// src/pages/dashboards/RecentActivity.jsx
import React from "react";
import { CheckCircle2, XCircle, Clock, Activity } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecentActivity({
    recentActivity,
    formatCurrency,
    onViewBooking,
}) {
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-blue-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-100/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
            case "cancelled":
                return "bg-red-100/60 dark:bg-red-900/20 text-red-600 dark:text-red-400";
            default:
                return "bg-blue-100/60 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
        }
    };

    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm h-full flex flex-col md:col-span-2">
            <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">
                            Recent Activity
                        </CardTitle>
                        <CardDescription className="mt-0.5">
                            Latest bookings and transactions
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden flex flex-col pt-6">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {recentActivity?.length > 0 ? (
                        recentActivity.map((booking) => (
                            <div
                                key={booking.id}
                                onClick={() =>
                                    onViewBooking && onViewBooking(booking)
                                }
                                className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/20 hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div
                                        className={`mt-1 p-2 rounded-lg shrink-0 ${getStatusColor(booking.status)}`}
                                    >
                                        {getStatusIcon(booking.status)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                {booking.user?.name ||
                                                    "Unknown Client"}
                                            </p>
                                        </div>

                                        {/* Attempt to show services in list if available */}
                                        <div className="flex flex-wrap gap-1 mt-1.5 mb-1.5">
                                            {booking.services &&
                                            booking.services.length > 0
                                                ? booking.services.map(
                                                      (service, idx) => (
                                                          <Badge
                                                              key={idx}
                                                              variant="secondary"
                                                              className="text-[10px] px-1.5 h-5 font-normal bg-purple-100/50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-0"
                                                          >
                                                              {service.name}
                                                          </Badge>
                                                      ),
                                                  )
                                                : // Optional: don't show anything if empty in list view to keep it clean
                                                  null}
                                        </div>

                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] capitalize h-5"
                                            >
                                                {booking.status}
                                            </Badge>
                                            <span className="text-[10px]">
                                                {new Date(
                                                    booking.created_at,
                                                ).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="text-sm font-bold text-foreground">
                                        {formatCurrency(booking.total_price)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            No recent activity
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
