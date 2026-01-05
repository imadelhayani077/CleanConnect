// components/BookingForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    DollarSign,
    Calendar as CalendarIcon,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema
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

export default function BookingForm({
    services,
    addresses,
    onSubmit,
    isSubmitting,
    submitError,
}) {
    // 1. Initialize Form with Data immediately available
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_ids: [],
            // Set default address immediately (No useEffect needed!)
            address_id: addresses.length > 0 ? String(addresses[0].id) : "",
            scheduled_at: "",
            notes: "",
        },
    });

    const { watch, setValue, getValues, control, handleSubmit, trigger } = form;

    // Calculate Total (Derived State - Good!)
    const selectedIds = watch("service_ids");
    const estimatedTotal = services
        .filter((s) => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + Number(s.base_price), 0);

    // Toggle Logic
    const toggleService = (serviceId) => {
        const currentIds = getValues("service_ids");
        const newIds = currentIds.includes(serviceId)
            ? currentIds.filter((id) => id !== serviceId)
            : [...currentIds, serviceId];
        setValue("service_ids", newIds);
        trigger("service_ids");
    };

    return (
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
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* SERVICE SELECTION */}
                        <FormField
                            control={control}
                            name="service_ids"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Select Services
                                    </FormLabel>
                                    <div className="grid gap-3 mt-2">
                                        {services.map((service) => {
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
                                                                {service.name}
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
                                                        ${service.base_price}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ADDRESS & DATE GRID */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={control}
                                name="address_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        {addresses.length === 0 ? (
                                            <div className="p-3 text-sm border border-amber-200 rounded-md bg-amber-50 text-amber-600">
                                                No addresses found.{" "}
                                                <a
                                                    href="/client/addresses"
                                                    className="font-bold underline"
                                                >
                                                    Add one
                                                </a>
                                                .
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

                        {/* NOTES */}
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
                                            placeholder="Gate code, key location..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SUBMIT AREA */}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
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
    );
}
