import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    History,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import { useMyBookings } from "@/Hooks/useBookings";

import BookingHistoryStatsCards from "./Components/BookingHistoryStatsCards";
import BookingHistoryFilters from "./Components/BookingHistoryFilters";
import BookingCard from "./Components/BookingCard";

import ReviewModal from "../Review/ReviewModal";
import EditBookingModal from "./Components/EditBookingModal";
import CancelBookingModal from "./Components/CancelBookingModal";
import BookingDetailModal from "./Components/BookingDetailModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BookingHistory() {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: bookings = [], isLoading } = useMyBookings();

    const [statusFilter, setStatusFilter] = useState("all");
    const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
    const [editingBooking, setEditingBooking] = useState(null);
    const [reviewingBooking, setReviewingBooking] = useState(null);
    const [cancellingBooking, setCancellingBooking] = useState(null);
    const [viewingBooking, setViewingBooking] = useState(null);

    useEffect(() => {
        if (location.state?.message) {
            setStatusMsg({ type: "success", msg: location.state.message });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSuccess = (msg) => {
        setStatusMsg({ type: "success", msg });
        setEditingBooking(null);
        setReviewingBooking(null);
        setCancellingBooking(null);
    };

    const filteredBookings = (bookings || []).filter((booking) => {
        if (statusFilter === "all") return true;
        return booking.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/dashboard")}
                            className="pl-0 hover:bg-transparent -ml-1 text-muted-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to
                            Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <History className="w-8 h-8 text-primary" />
                            Booking History
                        </h1>
                    </div>
                </div>
                {statusMsg.msg && (
                    <Alert className="mb-6 bg-emerald-50 border-emerald-200 text-emerald-800">
                        <AlertDescription className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {statusMsg.msg}
                        </AlertDescription>
                    </Alert>
                )}
                <BookingHistoryStatsCards bookings={bookings} />
                <div className="mt-8 mb-6">
                    <BookingHistoryFilters
                        activeFilter={statusFilter}
                        onFilterChange={setStatusFilter}
                    />
                </div>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">
                            Loading your missions...
                        </p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <Card className="border-dashed py-16">
                        <CardContent className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full bg-muted mb-4">
                                <Calendar className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="font-semibold text-xl">
                                No bookings found
                            </h3>
                            <p className="text-muted-foreground max-w-xs mt-2">
                                We couldn't find any{" "}
                                {statusFilter !== "all" ? statusFilter : ""}{" "}
                                bookings.
                            </p>
                            <Button
                                onClick={() => navigate("/booking")}
                                className="mt-6"
                            >
                                Book a Service Now
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onEdit={setEditingBooking}
                                onCancel={setCancellingBooking}
                                onReviewAction={setReviewingBooking}
                                onViewDetails={() => setViewingBooking(booking)}
                            />
                        ))}
                    </div>
                )}

                {/* Modal for Viewing Details */}
                <BookingDetailModal
                    open={!!viewingBooking}
                    booking={viewingBooking}
                    onClose={() => setViewingBooking(null)}
                />
                {/* Modal for Editing Booking - Now with full editing capabilities */}
                {editingBooking && (
                    <EditBookingModal
                        isOpen={!!editingBooking}
                        booking={editingBooking}
                        onClose={() => setEditingBooking(null)}
                        onSuccess={handleSuccess}
                    />
                )}
                {/* Other modals remain the same */}
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
