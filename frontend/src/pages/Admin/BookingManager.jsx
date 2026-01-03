// src/pages/Admin/BookingManager.jsx
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
} from "lucide-react";

import { useAllBookings, useEditBooking } from "@/Hooks/useBookings";

export default function BookingManager() {
    const { data: bookings = [], isLoading } = useAllBookings();
    const editBookingMutation = useEditBooking();

    const [filterStatus, setFilterStatus] = useState("all");

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
                data: { status: "cancelled" },
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

    const formatService = (type) =>
        type
            ? type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            : "General Cleaning";

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    const filteredBookings = bookings.filter((b) =>
        filterStatus === "all" ? true : b.status === filterStatus
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p>Syncing booking data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        All Bookings
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage client service requests.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        className="bg-background border border-border text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary block w-full md:w-48"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border font-semibold">
                            <tr>
                                <th className="px-6 py-4">Ref ID</th>
                                <th className="px-6 py-4">Client Details</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Schedule</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-muted rounded-full">
                                                <CalendarDays className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <p>
                                                No bookings found for this
                                                filter.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                            #
                                            {booking.id
                                                .toString()
                                                .padStart(4, "0")}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">
                                                        {booking.user?.name ||
                                                            "Unknown"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {booking.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {formatService(
                                                booking.service_type
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div
                                                className="flex items-center gap-1.5 text-muted-foreground max-w-[150px]"
                                                title={
                                                    booking.address
                                                        ?.street_address
                                                }
                                            >
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate text-xs">
                                                    {booking.address?.city ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                        </td>

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

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                                    booking.status
                                                )} uppercase tracking-wide`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {booking.status ===
                                                    "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    booking.id
                                                                )
                                                            }
                                                            disabled={
                                                                editBookingMutation.isPending
                                                            }
                                                            className="p-1.5 hover:bg-green-100 text-green-600 rounded-md transition-colors disabled:opacity-50"
                                                            title="Approve Request"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleReject(
                                                                    booking.id
                                                                )
                                                            }
                                                            disabled={
                                                                editBookingMutation.isPending
                                                            }
                                                            className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors disabled:opacity-50"
                                                            title="Reject Request"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
