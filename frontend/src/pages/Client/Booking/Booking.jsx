// src/pages/booking/Booking.jsx
import React, { useState, useMemo } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useAddress } from "@/Hooks/useAddress";
import { useServices } from "@/Hooks/useServices";
import { useCreateBooking } from "@/Hooks/useBookings";
import BookingForm from "./components/BookingForm";
import SuccessBookingModal from "./components/SuccessBookingModal";

export default function Booking() {
    const { data: services = [], isLoading: loadingServices } = useServices();
    const { addresses: addressData, loading: loadingAddresses } = useAddress();
    const {
        mutateAsync: createBookingMutation,
        isPending: isBookingSubmitting,
    } = useCreateBooking();

    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const verifiedAddresses = useMemo(() => {
        if (Array.isArray(addressData)) return addressData;
        if (addressData?.data && Array.isArray(addressData.data))
            return addressData.data;
        return [];
    }, [addressData]);

    if (loadingServices || loadingAddresses) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg font-medium">
                        Preparing your booking experience...
                    </p>
                </div>
            </div>
        );
    }

    const handleFormSubmit = async (formData) => {
        setSubmitError(null);
        try {
            const payload = {
                service_id: Number(formData.service_id),
                address_id: Number(formData.address_id),
                scheduled_at: formData.scheduled_at,
                options: (formData.options || []).map((id) => Number(id)),
                extras: (formData.extras || []).map((id) => Number(id)),
                final_price: Number(formData.final_price),
                notes: formData.notes || "",
            };

            const response = await createBookingMutation(payload);
            if (response) {
                setIsSuccess(true);
            }
        } catch (error) {
            const serverError =
                error.response?.data?.message || "Booking failed.";
            setSubmitError(serverError);
            console.error("Backend Error:", error.response?.data);
        }
    };

    if (isSuccess) {
        return <SuccessBookingModal />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Book a Service
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Customize your plan, choose a location, and let us
                        handle the rest.
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {submitError && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                            {submitError}
                        </div>
                    )}

                    <BookingForm
                        services={services}
                        addresses={verifiedAddresses}
                        onSubmit={handleFormSubmit}
                        isSubmitting={isBookingSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
