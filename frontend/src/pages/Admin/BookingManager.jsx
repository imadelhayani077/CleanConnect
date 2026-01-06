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
    Briefcase,
    X,
} from "lucide-react";

import { useAllBookings, useEditBooking } from "@/Hooks/useBookings";

export default function BookingManager() {
    const { data: bookings = [], isLoading } = useAllBookings();
    const editBookingMutation = useEditBooking();

    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null); // State for the Modal

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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Syncing booking data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative p-6">
            {/* Header & Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        All Bookings
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Monitor clients, sweepstars, and cancellations.
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
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">
                                    Assigned To (Sweepstar)
                                </th>
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

                                        {/* Client Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {booking.user?.name?.charAt(
                                                        0
                                                    ) || "U"}
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

                                        {/* Assigned Sweepstar Column */}
                                        <td className="px-6 py-4">
                                            {booking.sweepstar ? (
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        {booking.sweepstar.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic px-2 py-1 bg-muted rounded">
                                                    Unassigned
                                                </span>
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
                                                            className="p-1.5 hover:bg-green-100 text-green-600 rounded-md transition-colors"
                                                            title="Approve"
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
                                                            className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        setSelectedBooking(
                                                            booking
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-transparent hover:border-border"
                                                    title="View Full Details"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Details
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

            {/* --- DETAILS MODAL --- */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Booking Details
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Reference #{selectedBooking.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Cancellation Warning */}
                            {selectedBooking.status === "cancelled" && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-800">
                                            Booking Cancelled
                                        </h4>
                                        <p className="text-sm text-red-700 mt-1">
                                            Reason:{" "}
                                            <span className="font-medium">
                                                "
                                                {selectedBooking.cancellation_reason ||
                                                    "No reason provided"}
                                                "
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Client Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                        Client
                                    </h4>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {selectedBooking.user?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {selectedBooking.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sweepstar Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                        Assigned Sweepstar
                                    </h4>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {selectedBooking.sweepstar
                                                    ? selectedBooking.sweepstar
                                                          .name
                                                    : "Not Assigned"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {selectedBooking.sweepstar
                                                    ? selectedBooking.sweepstar
                                                          .email
                                                    : "Waiting for acceptance"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                    Services Requested
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedBooking.services &&
                                    selectedBooking.services.length > 0 ? (
                                        selectedBooking.services.map((s, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100"
                                            >
                                                {s.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            No specific services listed
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Location & Time */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                                        Location
                                    </h4>
                                    <p className="text-sm text-gray-700 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                        {
                                            selectedBooking.address
                                                ?.street_address
                                        }
                                        , {selectedBooking.address?.city}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                                        Schedule
                                    </h4>
                                    <p className="text-sm text-gray-700 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {formatDate(
                                            selectedBooking.scheduled_at
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
