import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMyBookings } from "@/Hooks/useBookings";
import BookingCard from "./components/BookingCard";
import ReviewModal from "./components/ReviewModal";
import EditBookingModal from "./components/EditBookingModal";
import CancelBookingModal from "./components/CancelBookingModal";

// Import the new components

export default function BookingHistory() {
    const navigate = useNavigate();
    const { data: bookings = [], isLoading } = useMyBookings();
    const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
    const [cancellingBooking, setCancellingBooking] = useState(null);
    // --- CLEAN STATE ---
    // Instead of 10 variables, we just track the active object
    const [editingBooking, setEditingBooking] = useState(null); // null = closed, object = open
    const [reviewingBooking, setReviewingBooking] = useState(null);

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Booking history is Loading...
                    </p>
                </div>
            </div>
        );

    const handleSuccess = (msg) => setStatusMsg({ type: "success", msg });

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Booking History</h2>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    Back
                </Button>
            </div>

            {statusMsg.msg && (
                <Alert className="bg-green-50 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{statusMsg.msg}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onEdit={() => setEditingBooking(booking)}
                        onReviewAction={() => setReviewingBooking(booking)}
                        onCancel={() => setCancellingBooking(booking)} // <--- Pass handler
                    />
                ))}
            </div>

            {/* --- RENDER MODALS CONDITIONALLY --- */}
            {/* The modal only exists when editingBooking is not null */}
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
    );
}
