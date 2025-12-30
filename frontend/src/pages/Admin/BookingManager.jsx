import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock Data
const MOCK_BOOKINGS = [
    {
        id: 101,
        client: "John Doe",
        service: "Deep Clean",
        date: "2024-02-15T10:00:00",
        status: "pending",
        amount: 120,
    },
    {
        id: 102,
        client: "Sarah Smith",
        service: "Move-in Clean",
        date: "2024-02-16T14:00:00",
        status: "confirmed",
        amount: 250,
    },
    {
        id: 103,
        client: "Mike Ross",
        service: "Standard Clean",
        date: "2024-02-14T09:00:00",
        status: "completed",
        amount: 80,
    },
    {
        id: 104,
        client: "Rachel Green",
        service: "Office Clean",
        date: "2024-02-20T11:00:00",
        status: "cancelled",
        amount: 150,
    },
];

export default function BookingManager() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API Fetch
        setTimeout(() => {
            setBookings(MOCK_BOOKINGS);
            setLoading(false);
        }, 800);
    }, []);

    // 1. Native Date Formatter Helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Helper for Status Badge Color
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
            <div className="p-10 text-center text-muted-foreground">
                Loading bookings...
            </div>
        );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        All Bookings
                    </h2>
                    <p className="text-muted-foreground">
                        Manage and track all service requests.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition">
                        Filter
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Service</th>
                                <th className="px-6 py-3">Date & Time</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        #{booking.id}
                                    </td>
                                    <td className="px-6 py-4 text-foreground">
                                        {booking.client}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {booking.service}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {/* 2. Use the helper here */}
                                            {formatDate(booking.date)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        ${booking.amount}
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
                                            <button
                                                className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {booking.status === "pending" && (
                                                <>
                                                    <button
                                                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full text-green-600 transition"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-600 transition"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
