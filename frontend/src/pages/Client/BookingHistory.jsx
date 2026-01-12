import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Loader2,
    CheckCircle2,
    History,
    Calendar,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import { useMyBookings } from "@/Hooks/useBookings";
import BookingCard from "./components/BookingCard";
import ReviewModal from "./components/ReviewModal";
import EditBookingModal from "./components/EditBookingModal";
import CancelBookingModal from "./components/CancelBookingModal";

export default function BookingHistory() {
    const navigate = useNavigate();
    const { data: bookings = [], isLoading } = useMyBookings();

    const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
    const [editingBooking, setEditingBooking] = useState(null);
    const [reviewingBooking, setReviewingBooking] = useState(null);
    const [cancellingBooking, setCancellingBooking] = useState(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">
                        Loading your bookings...
                    </p>
                </div>
            </div>
        );
    }

    const handleSuccess = (msg) => {
        setStatusMsg({ type: "success", msg });
        setTimeout(() => setStatusMsg({ type: "", msg: "" }), 4000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <History className="w-6 h-6 text-primary" />
                            </div>
                            Booking History
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage all your bookings
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-lg border-border/60 hover:bg-muted/50 gap-2 font-semibold"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                {/* Status Alert */}
                {statusMsg.msg && (
                    <Alert className="border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800/60 rounded-lg animate-in fade-in slide-in-from-top">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <AlertDescription className="text-emerald-800 dark:text-emerald-300">
                            {statusMsg.msg}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <Card className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center justify-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-muted/50 mb-6">
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                No bookings yet
                            </h3>
                            <p className="text-muted-foreground text-center mb-6 max-w-sm">
                                You haven't made any bookings. Start by booking
                                a service today!
                            </p>
                            <Button
                                className="rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all gap-2 font-semibold"
                                onClick={() => navigate("/booking")}
                            >
                                <Sparkles className="w-4 h-4" />
                                Book a Service
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 lg:gap-6">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onEdit={() => setEditingBooking(booking)}
                                onReviewAction={() =>
                                    setReviewingBooking(booking)
                                }
                                onCancel={() => setCancellingBooking(booking)}
                            />
                        ))}
                    </div>
                )}

                {/* Modals */}
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
