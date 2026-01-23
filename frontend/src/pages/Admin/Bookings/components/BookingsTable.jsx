import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    CalendarDays,
    CheckCircle,
    Clock,
    Eye,
    MapPin,
    XCircle,
} from "lucide-react";

import { getAvatarUrl, getInitials } from "@/utils/avatarHelper";

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
        <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50">
                        <TableHead className="px-2 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Ref ID
                        </TableHead>
                        <TableHead className="px-2 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Client
                        </TableHead>
                        <TableHead className="px-2 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Sweepstar
                        </TableHead>
                        <TableHead className="px-2 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Location
                        </TableHead>
                        <TableHead className="px-2 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Schedule
                        </TableHead>
                        <TableHead className="px-2 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Status
                        </TableHead>
                        <TableHead className="px-2 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {bookings.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="px-4 py-16 text-center"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <CalendarDays className="w-12 h-12 text-muted-foreground/20" />
                                    <p className="font-semibold text-muted-foreground">
                                        No bookings found
                                    </p>
                                    <p className="text-sm text-muted-foreground/70">
                                        Try adjusting your filters or create a
                                        new booking
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookings.map((booking) => (
                            <TableRow
                                key={booking.id}
                                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                onClick={() => onViewDetails(booking)}
                            >
                                <TableCell className="px-6 py-4 font-mono text-xs font-bold text-primary">
                                    #{booking.id.toString().padStart(4, "0")}
                                </TableCell>

                                {/* Client Column */}
                                <TableCell className="px-2 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border/50">
                                            <AvatarImage
                                                src={getAvatarUrl(booking.user)}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {getInitials(
                                                    booking.user?.name || "U",
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-foreground truncate text-sm">
                                                {booking.user?.name ||
                                                    "Unknown"}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {booking.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* [!code focus] Sweepstar Column - Updated Size & Details */}
                                <TableCell className="px-2 py-4">
                                    {booking.sweepstar ? (
                                        <div className="flex items-center gap-3">
                                            {/* Larger Avatar (h-9 w-9) */}
                                            <Avatar className="h-9 w-9 border border-border/50">
                                                <AvatarImage
                                                    src={getAvatarUrl(
                                                        booking.sweepstar,
                                                    )}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-blue-100/60 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                                    {getInitials(
                                                        booking.sweepstar.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-foreground truncate text-sm">
                                                    {booking.sweepstar.name}
                                                </div>
                                                {/* Added Email Display */}
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {booking.sweepstar.email}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-xs bg-muted/50"
                                        >
                                            Unassigned
                                        </Badge>
                                    )}
                                </TableCell>

                                <TableCell className="px-2 py-4">
                                    <div className="flex items-center gap-1.5 text-muted-foreground max-w-[150px]">
                                        <MapPin className="w-4 h-4 shrink-0 text-primary/60" />
                                        <span className="truncate text-sm font-medium">
                                            {booking.address?.city || "N/A"}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-2 py-4">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Clock className="w-4 h-4 shrink-0 text-primary/60" />
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {formatDate(booking.scheduled_at)}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-2 py-4">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs font-bold border ${getStatusColor(
                                            booking.status,
                                        )} uppercase tracking-wider flex w-fit gap-1.5 items-center`}
                                    >
                                        {getStatusIcon(booking.status)}
                                        {booking.status}
                                    </Badge>
                                </TableCell>

                                <TableCell className="px-2 py-4 text-right">
                                    <div className="flex justify-end gap-1.5">
                                        {/* Approve: Pending Only */}
                                        {booking.status === "pending" && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onApprove(booking.id);
                                                }}
                                                disabled={isMutating}
                                                title="Approve booking"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {/* Reject: Pending OR Confirmed */}
                                        {(booking.status === "pending" ||
                                            booking.status === "confirmed") && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onReject(booking.id);
                                                }}
                                                disabled={isMutating}
                                                title="Reject/Cancel booking"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/10 text-xs gap-1.5 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewDetails(booking);
                                            }}
                                            title="View details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
