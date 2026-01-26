import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { History, ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

import { useMyBookings } from "@/Hooks/useBookings";

import BookingHistoryStatsCards from "./Components/BookingHistoryStatsCards";
import BookingHistoryFilters from "./Components/BookingHistoryFilters";
import BookingCard from "./Components/BookingCard";

import ReviewModal from "../Review/ReviewModal";
import EditBookingModal from "./Components/EditBookingModal";
import CancelBookingModal from "./Components/CancelBookingModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BookingDetailModal from "./Components/BookingDetailModal";

export default function BookingHistory() {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: bookings = [], isLoading } = useMyBookings();

    const [statusFilter, setStatusFilter] = useState("all");
    const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
    const [editingBooking, setEditingBooking] = useState(null);
    const [reviewingBooking, setReviewingBooking] = useState(null);
    const [cancellingBooking, setCancellingBooking] = useState(null);

    // 2. STATE FOR DETAILS MODAL
    const [viewingBooking, setViewingBooking] = useState(null);

    useEffect(() => {
        if (location.state?.openBooking) {
            setReviewingBooking(location.state.openBooking);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSuccess = (msg) => {
        setStatusMsg({ type: "success", msg });
        setTimeout(() => setStatusMsg({ type: "", msg: "" }), 4000);
    };

    const filteredBookings = bookings.filter((booking) => {
        if (statusFilter === "all") return true;
        return booking.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex p-3">
                        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Loading your bookings...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <History className="w-8 h-8 text-primary" />
                            </div>
                            Booking History
                        </h1>
                        <p className="text-muted-foreground mt-2 ml-1">
                            View and manage all your past and upcoming services
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>

                {/* Status Message */}
                {statusMsg.msg && (
                    <div className="animate-in fade-in slide-in-from-top duration-300">
                        <Alert className="border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800/60 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <AlertDescription className="text-emerald-800 dark:text-emerald-300 font-medium">
                                {statusMsg.msg}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Statistics Cards */}
                <BookingHistoryStatsCards bookings={bookings} />

                {/* Filters */}
                <BookingHistoryFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    totalCount={bookings.length}
                    filteredCount={filteredBookings.length}
                />

                {/* Bookings List Grid */}
                {filteredBookings.length === 0 ? (
                    <Card className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center justify-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-6">
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                No bookings found
                            </h3>
                            <p className="text-muted-foreground text-center mb-6 max-w-sm">
                                {statusFilter === "all"
                                    ? "You haven't made any bookings yet."
                                    : `No ${statusFilter} bookings match your filter.`}
                            </p>
                            <Button
                                className="gap-2 px-8"
                                onClick={() => navigate("/booking")}
                            >
                                Book a Service Now
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onEdit={() => setEditingBooking(booking)}
                                onReviewAction={() =>
                                    setReviewingBooking(booking)
                                }
                                onCancel={() => setCancellingBooking(booking)}
                                // 3. PASS THE VIEW HANDLER
                                onViewDetails={() => setViewingBooking(booking)}
                            />
                        ))}
                    </div>
                )}

                {/* Modals */}

                {/* 4. RENDER DETAIL MODAL */}
                <BookingDetailModal
                    open={!!viewingBooking}
                    booking={viewingBooking}
                    onClose={() => setViewingBooking(null)}
                />

                {editingBooking && (
                    <EditBookingModal
                        isOpen={!!editingBooking}
                        booking={editingBooking}
                        onClose={() => setEditingBooking(null)}
                        onSuccess={handleSuccess}
                    />
                )}

                {cancellingBooking && (
                    <CancelBookingModal
                        isOpen={!!cancellingBooking}
                        booking={cancellingBooking}
                        onClose={() => setCancellingBooking(null)}
                        onSuccess={handleSuccess}
                    />
                )}

                {reviewingBooking && (
                    <ReviewModal
                        isOpen={!!reviewingBooking}
                        booking={reviewingBooking}
                        onClose={() => setReviewingBooking(null)}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </div>
    );
}
