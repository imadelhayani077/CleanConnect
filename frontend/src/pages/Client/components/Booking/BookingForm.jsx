// src/components/booking/BookingForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    DollarSign,
    Calendar as CalendarIcon,
    CheckCircle,
    AlertCircle,
    Sparkles,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const bookingSchema = z.object({
    service_ids: z
        .array(z.number())
        .min(1, "Please select at least one service"),
    address_id: z.string().min(1, "Please select an address"),
    scheduled_at: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Date must be in the future",
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
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_ids: [],
            address_id: addresses.length > 0 ? String(addresses[0].id) : "",
            scheduled_at: "",
            notes: "",
        },
    });

    const { watch, setValue, getValues, control, handleSubmit, trigger } = form;

    const selectedIds = watch("service_ids");
    const estimatedTotal = services
        .filter((s) => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + Number(s.base_price), 0);

    const toggleService = (serviceId) => {
        const currentIds = getValues("service_ids");
        const newIds = currentIds.includes(serviceId)
            ? currentIds.filter((id) => id !== serviceId)
            : [...currentIds, serviceId];
        setValue("service_ids", newIds);
        trigger("service_ids");
    };

    return (
        <Card className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-background to-muted/30 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Book a Service</CardTitle>
                </div>
                <CardDescription className="text-sm">
                    Select services, choose a location, and schedule your
                    cleaning
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
                {submitError && (
                    <Alert className="mb-6 border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-800 dark:text-red-300">
                            {submitError}
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* SERVICE SELECTION */}
                        <FormField
                            control={control}
                            name="service_ids"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold text-foreground">
                                        Select Services
                                    </FormLabel>
                                    <div className="grid gap-3 mt-3">
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
                                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                                                        isChecked
                                                            ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/50"
                                                            : "border-border/60 bg-background/50 hover:border-primary/30"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div
                                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                                isChecked
                                                                    ? "bg-primary border-primary text-primary-foreground"
                                                                    : "border-muted-foreground/50 hover:border-primary"
                                                            }`}
                                                        >
                                                            {isChecked && (
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-foreground">
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
                                                        variant="outline"
                                                        className={`ml-4 font-bold text-sm border-border/60 ${
                                                            isChecked
                                                                ? "bg-primary/10 text-primary"
                                                                : ""
                                                        }`}
                                                    >
                                                        ${service.base_price}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <FormMessage className="text-xs" />
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
                                        <FormLabel className="text-sm font-semibold">
                                            Location
                                        </FormLabel>
                                        {addresses.length === 0 ? (
                                            <div className="p-4 text-sm rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300">
                                                No addresses found.{" "}
                                                <a
                                                    href="/addresses"
                                                    className="font-bold underline hover:no-underline"
                                                >
                                                    Add one here
                                                </a>
                                                .
                                            </div>
                                        ) : (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-lg bg-muted/40 border-border/60 h-10">
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
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="scheduled_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">
                                            Date & Time
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="datetime-local"
                                                    className="pl-10 rounded-lg bg-muted/40 border-border/60 h-10"
                                                    {...field}
                                                    min={new Date()
                                                        .toISOString()
                                                        .slice(0, 16)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
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
                                    <FormLabel className="text-sm font-semibold">
                                        Special Instructions (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Gate code, key location, special requests..."
                                            className="resize-none rounded-lg bg-muted/40 border-border/60 min-h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* PRICE SUMMARY */}
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-6 rounded-xl border border-primary/20 dark:border-primary/30">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Estimated Total
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedIds.length} service
                                        {selectedIds.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                        selected
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        ${estimatedTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || selectedIds.length === 0}
                            className="w-full h-12 rounded-lg font-semibold text-base bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing Booking...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Confirm Booking
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
