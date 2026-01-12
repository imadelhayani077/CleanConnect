// src/pages/booking/Booking.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAddress } from "@/Hooks/useAddress";
import { useServices } from "@/Hooks/useServices";
import { useCreateBooking } from "@/Hooks/useBookings";
import BookingForm from "./components/BookingForm";

export default function Booking() {
    const navigate = useNavigate();

    const { data: services = [], isLoading: loadingServices } = useServices();
    const { addresses, loading: loadingAddresses } = useAddress();
    const {
        mutateAsync: createBookingMutation,
        isPending: isBookingSubmitting,
    } = useCreateBooking();

    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    if (loadingServices || loadingAddresses) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">
                        Loading booking details...
                    </p>
                </div>
            </div>
        );
    }

    const handleFormSubmit = async (data) => {
        setSubmitError(null);
        try {
            const formattedData = {
                ...data,
                address_id: parseInt(data.address_id, 10),
            };
            await createBookingMutation(formattedData);
            setIsSuccess(true);
        } catch (error) {
            console.error("Booking error:", error);
            setSubmitError(
                error?.response?.data?.message ||
                    "Booking failed. Please try again later."
            );
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-6">
                <Card className="max-w-lg w-full rounded-2xl border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-background dark:from-emerald-900/20 dark:to-background backdrop-blur-sm border-border/60 animate-in zoom-in-95 duration-300">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                        <div className="p-4 rounded-full bg-emerald-100/60 dark:bg-emerald-900/20">
                            <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-foreground">
                                Booking Confirmed!
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                We've received your request and will assign a
                                sweepstar shortly.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button
                                variant="outline"
                                className="rounded-lg border-border/60 hover:bg-muted/50 flex-1"
                                onClick={() => navigate("/bookings")}
                            >
                                View Booking
                            </Button>
                            <Button
                                className="rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all flex-1 gap-2 font-semibold"
                                onClick={() => navigate("/dashboard")}
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Book a Service
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Select your services, choose a location, and schedule
                        your cleaning
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BookingForm
                        services={services}
                        addresses={addresses}
                        onSubmit={handleFormSubmit}
                        isSubmitting={isBookingSubmitting}
                        submitError={submitError}
                    />
                </div>
            </div>
        </div>
    );
}
