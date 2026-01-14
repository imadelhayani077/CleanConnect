// src/components/booking/BookingManager.jsx
import React, { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";

import { useAllBookings, useEditBooking } from "@/Hooks/useBookings";

import BookingStats from "./components/Bookings/BookingStats";
import BookingFilter from "./components/Bookings/BookingFilter";
import BookingsTable from "./components/Bookings/BookingsTable";
import BookingDetailModal from "./components/Bookings/BookingDetailModal";

export default function BookingManager() {
    const { data: bookings = [], isLoading } = useAllBookings();
    const editBookingMutation = useEditBooking();

    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null);

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

            <BookingStats bookings={bookings} />

            <BookingFilter
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                stats={{
                    total: bookings.length,
                    pending: bookings.filter((b) => b.status === "pending")
                        .length,
                    confirmed: bookings.filter((b) => b.status === "confirmed")
                        .length,
                    completed: bookings.filter((b) => b.status === "completed")
                        .length,
                    cancelled: bookings.filter((b) => b.status === "cancelled")
                        .length,
                }}
            />

            <BookingsTable
                bookings={filteredBookings}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={setSelectedBooking}
                isMutating={editBookingMutation.isPending}
            />

            <BookingDetailModal
                booking={selectedBooking}
                open={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        </div>
    );
}
