import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom"; // Added for navigation

// Icons
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Loader2,
    DollarSign,
    Info,
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
import { Badge } from "@/components/ui/badge"; // Optional, looks nice for price

// Context
import { useAddress } from "@/Helper/AddressContext";
import { useBooking } from "@/Helper/BookingContext";

// --- 1. Zod Validation Schema ---
const bookingSchema = z.object({
    service_ids: z
        .array(z.number())
        .min(1, "Please select at least one service."),
    address_id: z.string().min(1, "Please select an address."),
    scheduled_at: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Date must be in the future.",
    }),
    notes: z.string().optional(),
});

export default function Booking() {
    // Context
    const { createBooking, fetchServices, services } = useBooking(); // Fetch services from here
    const { addresses, loading: loadingAddresses } = useAddress();
    console.log(services);

    // State
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // Load Services on Mount
    useEffect(() => {
        fetchServices();
    }, []);

    // --- 2. Form Setup ---
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_ids: [], // Array of numbers
            address_id: "",
            scheduled_at: "",
            notes: "",
        },
    });

    // Auto-select first address if available
    useEffect(() => {
        if (addresses.length > 0 && !form.getValues("address_id")) {
            form.setValue("address_id", String(addresses[0].id));
        }
    }, [addresses, form]);

    // --- Calculate Estimated Price ---
    // Watch the service_ids array to recalculate price dynamically
    const selectedIds = form.watch("service_ids");
    const estimatedTotal = services
        .filter((s) => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + Number(s.base_price), 0);

    // --- Helper to Toggle Services (Checkbox logic) ---
    const toggleService = (serviceId) => {
        const currentIds = form.getValues("service_ids");
        if (currentIds.includes(serviceId)) {
            form.setValue(
                "service_ids",
                currentIds.filter((id) => id !== serviceId)
            );
        } else {
            form.setValue("service_ids", [...currentIds, serviceId]);
        }
        // Trigger validation/re-render for price
        form.trigger("service_ids");
    };

    // --- 3. Submit Handler ---
    const onSubmit = async (data) => {
        try {
            // NOTE: We do NOT send total_price. The backend calculates it.
            const result = await createBooking(data);

            if (result.success) {
                setIsSuccess(true);
            } else {
                // Handle backend error (e.g., toast)
                console.error(result.message);
            }
        } catch (error) {
            console.error("Booking Error:", error);
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
                        className="border-green-600 text-green-700 hover:bg-green-100"
                        onClick={() => navigate("/client/dashboard")}
                    >
                        Go to Dashboard
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
                        Select services and schedule your cleaner.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* 1. Services Selection (Checkboxes) */}
                            <FormField
                                control={form.control}
                                name="service_ids"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Select Services
                                        </FormLabel>
                                        <div className="grid gap-3 mt-2">
                                            {services.length === 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Loading services...
                                                </p>
                                            )}

                                            {services.map((service) => {
                                                const isChecked = form
                                                    .getValues("service_ids")
                                                    .includes(service.id);
                                                return (
                                                    <div
                                                        key={service.id}
                                                        onClick={() =>
                                                            toggleService(
                                                                service.id
                                                            )
                                                        }
                                                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                                                            isChecked
                                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                                : "border-input"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {/* Custom Checkbox Appearance */}
                                                            <div
                                                                className={`w-5 h-5 rounded border flex items-center justify-center ${
                                                                    isChecked
                                                                        ? "bg-primary border-primary text-white"
                                                                        : "border-gray-400"
                                                                }`}
                                                            >
                                                                {isChecked && (
                                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium leading-none">
                                                                    {
                                                                        service.name
                                                                    }
                                                                </p>
                                                                {service.description && (
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {
                                                                            service.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-auto"
                                                        >
                                                            $
                                                            {service.base_price}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 2. Address Selection */}
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
                                                    href="/client/dashboard?tab=addresses"
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

                            {/* 3. Date & Time */}
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

                            {/* 4. Notes */}
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
                                                placeholder="Key is under the mat..."
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
                                    {estimatedTotal.toFixed(2)}
                                </div>
                            </div>

                            {/* Submit */}
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
