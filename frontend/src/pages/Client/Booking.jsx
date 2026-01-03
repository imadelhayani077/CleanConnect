import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

// Icons
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Loader2,
    DollarSign,
    AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Hooks
import { useAddress } from "@/Hooks/useAddress";
import { useServices } from "@/Hooks/useServices";
import { useCreateBooking } from "@/Hooks/useBookings";

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
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    // --- 2. DATA HOOKS ---
    const { data: services = [], isLoading: loadingServices } = useServices();
    const { addresses, loading: loadingAddresses } = useAddress();
    const {
        mutateAsync: createBookingMutation,
        isPending: isBookingSubmitting,
    } = useCreateBooking();

    // --- 3. Form Setup ---
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_ids: [],
            address_id: "",
            scheduled_at: "",
            notes: "",
        },
    });

    const { setValue, watch, trigger, getValues, handleSubmit, control } = form;

    // Auto-select default address
    useEffect(() => {
        if (!loadingAddresses && addresses && addresses.length > 0) {
            const currentAddress = getValues("address_id");
            if (!currentAddress) {
                setValue("address_id", String(addresses[0].id));
            }
        }
    }, [addresses, loadingAddresses, setValue, getValues]);

    // Calculate estimated price
    const selectedIds = watch("service_ids");
    const estimatedTotal = services
        .filter((s) => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + Number(s.base_price), 0);

    // Toggle service
    const toggleService = (serviceId) => {
        const currentIds = getValues("service_ids");
        if (currentIds.includes(serviceId)) {
            setValue(
                "service_ids",
                currentIds.filter((id) => id !== serviceId)
            );
        } else {
            setValue("service_ids", [...currentIds, serviceId]);
        }
        trigger("service_ids");
    };

    // --- 4. Submit Handler ---
    const onSubmit = async (data) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            const formattedData = {
                ...data,
                address_id: parseInt(data.address_id, 10),
            };

            await createBookingMutation(formattedData);

            setIsSuccess(true);
            setSubmitSuccess("Your booking has been placed.");
        } catch (error) {
            console.error("Booking submission error:", error);
            const serverMessage =
                error?.response?.data?.message || "Please try again later.";
            setSubmitError(serverMessage);
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

                    {submitSuccess && (
                        <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{submitSuccess}</AlertDescription>
                        </Alert>
                    )}
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
                    {submitError && (
                        <div className="mb-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Booking Failed</AlertTitle>
                                <AlertDescription>
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* 1. Services Selection */}
                            <FormField
                                control={control}
                                name="service_ids"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Select Services
                                        </FormLabel>
                                        <div className="grid gap-3 mt-2">
                                            {loadingServices && (
                                                <div className="flex items-center justify-center p-4">
                                                    <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}

                                            {!loadingServices &&
                                                services.length === 0 && (
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted p-3 rounded">
                                                        <AlertCircle className="w-4 h-4" />
                                                        No services available at
                                                        the moment.
                                                    </div>
                                                )}

                                            {!loadingServices &&
                                                services.map((service) => {
                                                    const isChecked = watch(
                                                        "service_ids"
                                                    ).includes(service.id);
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
                                                                <div
                                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
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
                                                                {
                                                                    service.base_price
                                                                }
                                                            </Badge>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* SECTION 2: ADDRESS & DATE */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Address Selection */}
                                <FormField
                                    control={control}
                                    name="address_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            {loadingAddresses ? (
                                                <div className="flex items-center gap-2 p-2 text-sm border rounded-md text-muted-foreground">
                                                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                                    Loading addresses...
                                                </div>
                                            ) : addresses.length === 0 ? (
                                                <div className="p-3 text-sm border border-amber-200 rounded-md bg-amber-50 text-amber-600">
                                                    No saved addresses.{" "}
                                                    <span
                                                        onClick={() =>
                                                            navigate(
                                                                "/client/addresses"
                                                            )
                                                        }
                                                        className="font-bold underline cursor-pointer hover:text-amber-800"
                                                    >
                                                        Add one
                                                    </span>
                                                    .
                                                </div>
                                            ) : (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select address" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {addresses.map(
                                                            (addr) => (
                                                                <SelectItem
                                                                    key={
                                                                        addr.id
                                                                    }
                                                                    value={String(
                                                                        addr.id
                                                                    )}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                                                        <span>
                                                                            {
                                                                                addr.street_address
                                                                            }
                                                                            ,{" "}
                                                                            {
                                                                                addr.city
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date & Time */}
                                <FormField
                                    control={control}
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
                                                        min={new Date()
                                                            .toISOString()
                                                            .slice(0, 16)}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Notes */}
                            <FormField
                                control={control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Special Instructions (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Key is under the mat, gate code is 1234..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Total Price & Submit Button */}
                            <div className="bg-muted/30 p-4 rounded-lg border flex justify-between items-center">
                                <span className="font-medium text-muted-foreground">
                                    Estimated Total
                                </span>
                                <div className="flex items-center text-2xl font-bold text-primary">
                                    <DollarSign className="w-5 h-5 mt-0.5" />
                                    {estimatedTotal.toFixed(2)}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-lg py-6"
                                disabled={
                                    isBookingSubmitting ||
                                    loadingAddresses ||
                                    loadingServices
                                }
                            >
                                {isBookingSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
