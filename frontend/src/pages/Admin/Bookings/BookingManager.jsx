// src/pages/dashboards/BookingManager.jsx
import React, { useState } from "react";
import { Loader2, BarChart3 } from "lucide-react";
import { useAllBookings, useEditBooking } from "@/Hooks/useBookings";
import BookingStats from "./components/BookingStats";
import BookingFilter from "./components/BookingFilter";
import BookingsTable from "./components/BookingsTable";
import BookingDetailModal from "./components/BookingDetailModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal"; // [!code focus] 1. Import the modal

export default function BookingManager() {
    const { data: bookings = [], isLoading } = useAllBookings();
    const editBookingMutation = useEditBooking();
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null);

    // [!code focus] 2. Add state for the confirmation modal
    const [confirmState, setConfirmState] = useState({
        open: false,
        type: null, // 'APPROVE' or 'REJECT'
        id: null,
    });

    // [!code focus] 3. Handler to open modal for Approval
    const handleApproveClick = (id) => {
        setConfirmState({
            open: true,
            type: "APPROVE",
            id,
        });
    };

    // [!code focus] 4. Handler to open modal for Rejection (Replacing window.confirm)
    const handleRejectClick = (id) => {
        setConfirmState({
            open: true,
            type: "REJECT",
            id,
        });
    };

    // [!code focus] 5. The generic execution function
    const handleFinalConfirmation = async () => {
        const { type, id } = confirmState;

        try {
            if (type === "APPROVE") {
                await editBookingMutation.mutateAsync({
                    id,
                    data: { status: "confirmed" },
                });
            } else if (type === "REJECT") {
                await editBookingMutation.mutateAsync({
                    id,
                    data: {
                        status: "cancelled",
                        cancellation_reason: "Rejected by Admin",
                    },
                });
            }
            // Close modal on success
            setConfirmState({ ...confirmState, open: false });
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    // [!code focus] 6. Helper to get dynamic text for the modal
    const getModalContent = () => {
        if (confirmState.type === "APPROVE") {
            return {
                title: "Confirm Booking?",
                description:
                    "Are you sure you want to mark this booking as confirmed?",
                variant: "default",
                confirmText: "Confirm Booking",
            };
        }
        return {
            title: "Reject Booking?",
            description:
                "Are you sure you want to reject this booking? This action cannot be undone.",
            variant: "destructive",
            confirmText: "Reject Booking",
        };
    };

    const modalContent = getModalContent();

    const filteredBookings = bookings.filter((b) =>
        filterStatus === "all" ? true : b.status === filterStatus,
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
                            (b) => b.status === "confirmed",
                        ).length,
                        completed: bookings.filter(
                            (b) => b.status === "completed",
                        ).length,
                        cancelled: bookings.filter(
                            (b) => b.status === "cancelled",
                        ).length,
                    }}
                />

                <BookingsTable
                    bookings={filteredBookings}
                    // [!code focus] 7. Pass the new handlers that open the modal
                    onApprove={handleApproveClick}
                    onReject={handleRejectClick}
                    onViewDetails={setSelectedBooking}
                    isMutating={editBookingMutation.isPending} // This is for table row loading state
                />
            </div>

            <BookingDetailModal
                booking={selectedBooking}
                open={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />

            {/* [!code focus] 8. Render the Confirmation Modal */}
            <ConfirmationModal
                open={confirmState.open}
                onClose={() =>
                    setConfirmState({ ...confirmState, open: false })
                }
                onConfirm={handleFinalConfirmation}
                title={modalContent.title}
                description={modalContent.description}
                variant={modalContent.variant}
                confirmText={modalContent.confirmText}
                isLoading={editBookingMutation.isPending}
            />
        </div>
    );
}
