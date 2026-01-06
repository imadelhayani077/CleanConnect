// Booking.jsx (The Main Page)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Hooks
import { useAddress } from "@/Hooks/useAddress";
import { useServices } from "@/Hooks/useServices";
import { useCreateBooking } from "@/Hooks/useBookings";
import BookingForm from "./components/BookingForm";

// Import the child form

export default function Booking() {
    const navigate = useNavigate();

    // --- Data Hooks ---
    const { data: services = [], isLoading: loadingServices } = useServices();
    const { addresses, loading: loadingAddresses } = useAddress();
    const {
        mutateAsync: createBookingMutation,
        isPending: isBookingSubmitting,
    } = useCreateBooking();

    // --- State ---
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // --- Loading Guard ---
    // Ideally, show a skeleton here, but a spinner is fine for now
    if (loadingServices || loadingAddresses) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Loading booking details...
                    </p>
                </div>
            </div>
        );
    }

    // --- Submit Handler ---
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
                error?.response?.data?.message || "Please try again later."
            );
        }
    };

    // --- Success View ---
    if (isSuccess) {
        return (
            <Card className="max-w-lg mx-auto mt-8 border-green-200 bg-green-50 animate-in zoom-in-95 duration-300">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800">
                        Booking Confirmed!
                    </h2>
                    <p className="text-green-700">
                        We have received your request.
                    </p>
                    <Button
                        variant="outline"
                        className="border-green-600 text-green-700 hover:bg-green-100"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // --- Render Form ---
    // We only render this when data is loaded, so defaults work automatically
    return (
        <div className="max-w-2xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4">
            <BookingForm
                services={services}
                addresses={addresses}
                onSubmit={handleFormSubmit}
                isSubmitting={isBookingSubmitting}
                submitError={submitError}
            />
        </div>
    );
}
