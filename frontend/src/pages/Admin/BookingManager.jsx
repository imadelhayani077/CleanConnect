import React, { useState } from "react";
import { Loader2, BarChart3 } from "lucide-react";
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
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                    <p className="text-muted-foreground font-semibold">
                        Loading bookings...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-primary/8 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent p-8 md:p-10">
                {/* Decorative Blobs */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-3xl dark:bg-primary/10"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl dark:bg-primary/5"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                            <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            Booking Management
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Monitor and manage all client bookings, sweepstar
                        assignments, and service delivery
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <BookingStats bookings={bookings} />

            {/* Filter & Table Section */}
            <div className="space-y-4">
                <BookingFilter
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                    stats={{
                        total: bookings.length,
                        pending: bookings.filter((b) => b.status === "pending")
                            .length,
                        confirmed: bookings.filter(
                            (b) => b.status === "confirmed"
                        ).length,
                        completed: bookings.filter(
                            (b) => b.status === "completed"
                        ).length,
                        cancelled: bookings.filter(
                            (b) => b.status === "cancelled"
                        ).length,
                    }}
                />

                <BookingsTable
                    bookings={filteredBookings}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={setSelectedBooking}
                    isMutating={editBookingMutation.isPending}
                />
            </div>

            <BookingDetailModal
                booking={selectedBooking}
                open={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        </div>
    );
}
