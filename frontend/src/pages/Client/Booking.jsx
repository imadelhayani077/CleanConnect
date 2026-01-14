import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useAddress } from "@/Hooks/useAddress";
import { useServices } from "@/Hooks/useServices";
import { useCreateBooking } from "@/Hooks/useBookings";
import BookingForm from "./components/Booking/BookingForm";
import SuccessBookingModal from "./components/Booking/SuccessBookingModal";

export default function Booking() {
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
        return <SuccessBookingModal />;
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
