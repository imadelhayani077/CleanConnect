// src/pages/admin/BookingManager.jsx
import React, { useState } from "react";
import {
    Eye,
    Clock,
    MapPin,
    CheckCircle,
    XCircle,
    User,
    Filter,
    CalendarDays,
    Loader2,
    Briefcase,
    X,
    AlertTriangle,
    TrendingUp,
    AlertCircle,
} from "lucide-react";

import { useAllBookings, useEditBooking } from "@/Hooks/useBookings";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function BookingManager() {
    const { data: bookings = [], isLoading } = useAllBookings();
    const editBookingMutation = useEditBooking();

    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Statistics
    const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };

    const handleApprove = async (id) => {
        await editBookingMutation.mutateAsync({
            id,
            data: { status: "confirmed" },
        });
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to reject this booking?")) {
            await editBookingMutation.mutateAsync({
                id,
                data: {
                    status: "cancelled",
                    cancellation_reason: "Rejected by Admin",
                },
            });
        }
    };

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

    const filteredBookings = bookings.filter((b) =>
        filterStatus === "all" ? true : b.status === filterStatus
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">
                        Loading bookings...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <CalendarDays className="w-6 h-6 text-primary" />
                        </div>
                        Booking Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage all client bookings and assignments
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    {
                        label: "Total",
                        value: stats.total,
                        icon: CalendarDays,
                        color: "from-primary/20 to-primary/10 text-primary",
                    },
                    {
                        label: "Pending",
                        value: stats.pending,
                        icon: Clock,
                        color: "from-amber-100/60 to-amber-50/60 dark:from-amber-900/20 dark:to-amber-900/10 text-amber-600 dark:text-amber-400",
                    },
                    {
                        label: "Confirmed",
                        value: stats.confirmed,
                        icon: CheckCircle,
                        color: "from-blue-100/60 to-blue-50/60 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-600 dark:text-blue-400",
                    },
                    {
                        label: "Completed",
                        value: stats.completed,
                        icon: TrendingUp,
                        color: "from-emerald-100/60 to-emerald-50/60 dark:from-emerald-900/20 dark:to-emerald-900/10 text-emerald-600 dark:text-emerald-400",
                    },
                    {
                        label: "Cancelled",
                        value: stats.cancelled,
                        icon: XCircle,
                        color: "from-red-100/60 to-red-50/60 dark:from-red-900/20 dark:to-red-900/10 text-red-600 dark:text-red-400",
                    },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={idx}
                            className={`rounded-xl border-border/60 bg-gradient-to-br ${stat.color} backdrop-blur-sm`}
                        >
                            <CardContent className="p-4 text-center">
                                <Icon className="w-5 h-5 mx-auto mb-2 opacity-60" />
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stat.value}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                        Filter by Status:
                    </span>
                </div>
                <select
                    className="px-4 py-2 rounded-lg border border-border/60 bg-muted/40 text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Statuses ({stats.total})</option>
                    <option value="pending">Pending ({stats.pending})</option>
                    <option value="confirmed">
                        Confirmed ({stats.confirmed})
                    </option>
                    <option value="completed">
                        Completed ({stats.completed})
                    </option>
                    <option value="cancelled">
                        Cancelled ({stats.cancelled})
                    </option>
                </select>
            </div>

            {/* Bookings Table */}
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
                            {filteredBookings.length === 0 ? (
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
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground font-medium">
                                            #
                                            {booking.id
                                                .toString()
                                                .padStart(4, "0")}
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
                                                    {booking.address?.city ||
                                                        "N/A"}
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
                                                {booking.status ===
                                                    "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    booking.id
                                                                )
                                                            }
                                                            disabled={
                                                                editBookingMutation.isPending
                                                            }
                                                            title="Approve booking"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                            onClick={() =>
                                                                handleReject(
                                                                    booking.id
                                                                )
                                                            }
                                                            disabled={
                                                                editBookingMutation.isPending
                                                            }
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
                                                        setSelectedBooking(
                                                            booking
                                                        )
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

            {/* Details Modal */}
            <Dialog
                open={!!selectedBooking}
                onOpenChange={() => setSelectedBooking(null)}
            >
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-border/60 bg-background/80 backdrop-blur-xl">
                    {/* Header */}
                    <DialogHeader className="p-6 border-b border-border/60 bg-gradient-to-r from-background to-muted/30">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-foreground">
                                    Booking Details
                                </DialogTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Reference #{selectedBooking?.id}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedBooking(null)}
                                className="h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {selectedBooking && (
                            <div className="space-y-6">
                                {/* Cancellation Alert */}
                                {selectedBooking.status === "cancelled" && (
                                    <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <AlertDescription className="text-red-800 dark:text-red-300">
                                            <span className="font-semibold">
                                                Booking Cancelled
                                            </span>
                                            {" - "}
                                            {selectedBooking.cancellation_reason ||
                                                "No reason provided"}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Client Info */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                            Client Information
                                        </h4>
                                        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {selectedBooking.user?.name?.charAt(
                                                        0
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {
                                                            selectedBooking.user
                                                                ?.name
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            selectedBooking.user
                                                                ?.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sweepstar Info */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                            Assigned Sweepstar
                                        </h4>
                                        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100/60 dark:bg-blue-900/20 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                                                    {selectedBooking.sweepstar
                                                        ? selectedBooking.sweepstar.name?.charAt(
                                                              0
                                                          )
                                                        : "?"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {selectedBooking.sweepstar
                                                            ? selectedBooking
                                                                  .sweepstar
                                                                  .name
                                                            : "Not Assigned"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedBooking.sweepstar
                                                            ? selectedBooking
                                                                  .sweepstar
                                                                  .email
                                                            : "Waiting for assignment"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                {/* Services */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Services Requested
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedBooking.services &&
                                        selectedBooking.services.length > 0 ? (
                                            selectedBooking.services.map(
                                                (s, i) => (
                                                    <Badge
                                                        key={i}
                                                        className="bg-purple-100/60 text-purple-700 border-purple-200/60 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/60"
                                                    >
                                                        {s.name}
                                                    </Badge>
                                                )
                                            )
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No specific services listed
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                {/* Location & Time */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                            Location
                                        </h4>
                                        <p className="text-sm text-foreground flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span>
                                                {selectedBooking.address
                                                    ?.street_address || "N/A"}
                                                ,{" "}
                                                {selectedBooking.address?.city}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                            Scheduled Date & Time
                                        </h4>
                                        <p className="text-sm text-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            {formatDate(
                                                selectedBooking.scheduled_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
