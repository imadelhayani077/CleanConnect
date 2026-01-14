// src/components/booking/BookingsTable.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    CalendarDays,
    CheckCircle,
    Clock,
    Eye,
    MapPin,
    XCircle,
} from "lucide-react";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString));
};

const getStatusColor = (status) => {
    switch (status) {
        case "confirmed":
            return "bg-blue-100/60 text-blue-700 border-blue-200/60 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60";
        case "completed":
            return "bg-emerald-100/60 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60";
        case "cancelled":
            return "bg-red-100/60 text-red-700 border-red-200/60 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/60";
        default:
            return "bg-amber-100/60 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60";
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case "confirmed":
            return (
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            );
        case "completed":
            return (
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            );
        case "cancelled":
            return (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            );
        default:
            return (
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            );
    }
};

export default function BookingsTable({
    bookings,
    onApprove,
    onReject,
    onViewDetails,
    isMutating,
}) {
    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border/60 bg-muted/30 hover:bg-muted/30">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Ref ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Sweepstar
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Schedule
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {bookings.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <CalendarDays className="w-12 h-12 text-muted-foreground/20" />
                                        <p className="font-medium text-muted-foreground">
                                            No bookings found
                                        </p>
                                        <p className="text-sm text-muted-foreground/70">
                                            Try adjusting your filters
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground font-medium">
                                        #
                                        {booking.id.toString().padStart(4, "0")}
                                    </td>

                                    {/* Client */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {booking.user?.name?.charAt(
                                                    0
                                                ) || "U"}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-foreground truncate">
                                                    {booking.user?.name ||
                                                        "Unknown"}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {booking.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Sweepstar */}
                                    <td className="px-6 py-4">
                                        {booking.sweepstar ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100/60 dark:bg-blue-900/20 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
                                                    {booking.sweepstar.name?.charAt(
                                                        0
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {booking.sweepstar.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-muted/50"
                                            >
                                                Unassigned
                                            </Badge>
                                        )}
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground max-w-[150px]">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate text-xs">
                                                {booking.address?.city || "N/A"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Schedule */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5 shrink-0" />
                                            <span className="text-xs whitespace-nowrap">
                                                {formatDate(
                                                    booking.scheduled_at
                                                )}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs font-semibold border ${getStatusColor(
                                                booking.status
                                            )} uppercase tracking-wider flex w-fit gap-1 items-center`}
                                        >
                                            {getStatusIcon(booking.status)}
                                            {booking.status}
                                        </Badge>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            {booking.status === "pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
                                                        onClick={() =>
                                                            onApprove(
                                                                booking.id
                                                            )
                                                        }
                                                        disabled={isMutating}
                                                        title="Approve booking"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                        onClick={() =>
                                                            onReject(booking.id)
                                                        }
                                                        disabled={isMutating}
                                                        title="Reject booking"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs gap-1"
                                                onClick={() =>
                                                    onViewDetails(booking)
                                                }
                                                title="View details"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Details
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
