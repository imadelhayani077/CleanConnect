import React, { useEffect } from "react"; // Import useEffect
import { Eye, Clock, MapPin, CheckCircle, XCircle, User } from "lucide-react";
import { useBooking } from "@/Helper/BookingContext";
// Ensure this path matches where you saved the Context file

export default function BookingManager() {
    // Destructure fetchAllBookings from context
    const { bookings, loading, fetchAllBookings } = useBooking();
    console.log(bookings);

    // Trigger the Admin Fetch when this page loads
    useEffect(() => {
        fetchAllBookings();
    }, [fetchAllBookings]);

    // --- Admin Actions ---
    const handleApprove = (id) => {
        console.log("Approve booking:", id);
        // TODO: Call API
    };

    const handleReject = (id) => {
        if (window.confirm("Are you sure you want to reject this booking?")) {
            console.log("Reject booking:", id);
            // TODO: Call API
        }
    };

    // --- Formatters (Same as before) ---
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
            : "Service";

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
            case "completed":
                return "bg-green-500/15 text-green-600 dark:text-green-400";
            case "cancelled":
                return "bg-red-500/15 text-red-600 dark:text-red-400";
            default:
                return "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400";
        }
    };

    if (loading)
        return (
            <div className="p-10 text-center text-muted-foreground animate-pulse">
                Loading bookings...
            </div>
        );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... Header ... */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        All Bookings
                    </h2>
                    <p className="text-muted-foreground">
                        Manage incoming service requests from clients.
                    </p>
                </div>
            </div>

            {/* ... Table ... */}
            <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Service</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No bookings found in the system.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            #{booking.id}
                                        </td>
                                        <td className="px-6 py-4 text-foreground">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {booking.user
                                                        ? booking.user.name
                                                        : "Unknown User"}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground pl-5">
                                                {booking.user?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatService(
                                                booking.service_type
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div
                                                className="flex items-center gap-2"
                                                title={
                                                    booking.address
                                                        ?.street_address
                                                }
                                            >
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate max-w-[150px]">
                                                    {booking.address
                                                        ? booking.address.city
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(
                                                    booking.scheduled_at
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {booking.status ===
                                                    "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    booking.id
                                                                )
                                                            }
                                                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full text-green-600 transition"
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
                                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-600 transition"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition"
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
