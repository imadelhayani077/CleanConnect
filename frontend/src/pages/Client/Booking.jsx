import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns"; // Standard date library used by Shadcn

// Context & API

// Icons
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Loader2,
    DollarSign,
    MapPin,
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- 1. Zod Validation Schema ---
const bookingSchema = z.object({
    service_type: z.string().min(1, "Please select a service type."),
    address_id: z.string().min(1, "Please select an address."),
    scheduled_at: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Date must be in the future.",
    }),
    notes: z.string().optional(),
});

// Service Prices Mapping
const SERVICE_PRICES = {
    "Standard Clean": 50,
    "Deep Clean": 100,
    "Move-in/Move-out": 150,
    "Office Clean": 200,
};

import { useAddress } from "@/Helper/AddressContext";
import { useBooking } from "@/Helper/BookingContext";

export default function Booking({ onSuccess }) {
    const { createBooking } = useBooking();

    const { addresses, loading: loadingAddresses } = useAddress();
    const [totalPrice, setTotalPrice] = useState(50);
    const [isSuccess, setIsSuccess] = useState(false);

    // --- 2. Form Setup ---
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_type: "Standard Clean",
            address_id: "",
            scheduled_at: "", // HTML datetime-local string
            notes: "",
        },
    });

    // Watch service type to update price dynamically
    const selectedService = form.watch("service_type");

    useEffect(() => {
        if (selectedService && SERVICE_PRICES[selectedService]) {
            setTotalPrice(SERVICE_PRICES[selectedService]);
        }
    }, [selectedService]);

    // Auto-select first address if available
    useEffect(() => {
        if (addresses.length > 0 && !form.getValues("address_id")) {
            form.setValue("address_id", String(addresses[0].id));
        }
    }, [addresses, form]);

    // --- 3. Submit Handler ---
    const onSubmit = async (data) => {
        try {
            // Add price to the payload
            const payload = { ...data, total_price: totalPrice };

            // USE CONTEXT INSTEAD OF API DIRECTLY
            const result = await createBooking(payload);

            if (result.success) {
                setIsSuccess(true);
                if (onSuccess) setTimeout(() => onSuccess(), 2000);
            }
        } catch (error) {
            console.error("Booking Error:", error);
            // You can set a root error here if you want
        }
    };

    // --- SUCCESS STATE RENDER ---
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
                        We have received your request. You can track its status
                        in your dashboard.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/dashboard")}
                    >
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // --- FORM RENDER ---
    return (
        <div className="max-w-2xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4">
            <Card className="shadow-lg border-muted/60">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        ✨ Book a Service
                    </CardTitle>
                    <CardDescription>
                        Fill in the details below to schedule your next
                        cleaning.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Service Type Selection */}
                            <FormField
                                control={form.control}
                                name="service_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a service" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.keys(
                                                    SERVICE_PRICES
                                                ).map((service) => (
                                                    <SelectItem
                                                        key={service}
                                                        value={service}
                                                    >
                                                        {service}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date & Time Picker (Native Input for simplicity/mobile support) */}
                            <FormField
                                control={form.control}
                                name="scheduled_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="datetime-local"
                                                    className="pl-9"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Address Selection (From Context) */}
                            <FormField
                                control={form.control}
                                name="address_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        {loadingAddresses ? (
                                            <div className="flex items-center text-sm text-muted-foreground gap-2 p-2 border rounded-md">
                                                <Loader2 className="animate-spin h-4 w-4" />{" "}
                                                Loading addresses...
                                            </div>
                                        ) : addresses.length === 0 ? (
                                            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                                                You have no saved addresses.{" "}
                                                <a
                                                    href="/dashboard?tab=my-addresses"
                                                    className="underline font-bold"
                                                >
                                                    Add one here
                                                </a>{" "}
                                                first.
                                            </div>
                                        ) : (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select address" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {addresses.map((addr) => (
                                                        <SelectItem
                                                            key={addr.id}
                                                            value={String(
                                                                addr.id
                                                            )}
                                                        >
                                                            {
                                                                addr.street_address
                                                            }
                                                            , {addr.city}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Notes Field */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Special Instructions (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Key is under the mat, please be careful with the cat..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price Summary */}
                            <div className="bg-muted/30 p-4 rounded-lg border flex justify-between items-center">
                                <span className="font-medium text-muted-foreground">
                                    Estimated Total
                                </span>
                                <div className="flex items-center text-2xl font-bold text-primary">
                                    <DollarSign className="w-5 h-5 mt-0.5" />
                                    {totalPrice}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full text-lg py-6"
                                disabled={
                                    form.formState.isSubmitting ||
                                    addresses.length === 0
                                }
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                                        Processing...
                                    </>
                                ) : (
                                    "Confirm Booking"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
