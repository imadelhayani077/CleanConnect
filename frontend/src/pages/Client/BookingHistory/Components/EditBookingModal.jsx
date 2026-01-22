// src/components/booking/EditBookingModal.jsx
import React, { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
    Loader2,
    AlertCircle,
    DollarSign,
    Calendar,
    CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useServices } from "@/Hooks/useServices";
import { useAddress } from "@/Hooks/useAddress";
import { useEditBooking } from "@/Hooks/useBookings";

export default function EditBookingModal({
    booking,
    isOpen,
    onClose,
    onSuccess,
}) {
    const { data: services = [], isLoading: loadingServices } = useServices();
    const { addresses, loading: loadingAddresses } = useAddress();
    const { mutateAsync: updateBooking, isPending } = useEditBooking();

    const form = useForm({
        defaultValues: {
            address_id: "",
            scheduled_at: "",
            notes: "",
            service_ids: [],
        },
    });

    useEffect(() => {
        if (booking && isOpen) {
            form.reset({
                address_id: booking.address_id
                    ? String(booking.address_id)
                    : "",
                scheduled_at: booking.scheduled_at
                    ? format(
                          new Date(booking.scheduled_at),
                          "yyyy-MM-dd'T'HH:mm"
                      )
                    : "",
                notes: booking.notes || "",
                service_ids: booking.services?.map((s) => s.id) || [],
            });
        }
    }, [booking, isOpen, form]);

    const isLoading = loadingServices || loadingAddresses;
    const serviceIds = form.watch("service_ids");

    const total = useMemo(
        () =>
            services
                .filter((s) => serviceIds?.includes(s.id))
                .reduce((sum, s) => sum + Number(s.base_price), 0),
        [services, serviceIds]
    );

    const onSubmit = async (values) => {
        try {
            if (
                !values.scheduled_at ||
                !values.address_id ||
                !values.service_ids.length
            ) {
                return;
            }

            const payload = {
                scheduled_at: new Date(values.scheduled_at).toISOString(),
                notes: values.notes,
                address_id: parseInt(values.address_id, 10),
                service_ids: values.service_ids,
            };

            await updateBooking({ id: booking.id, data: payload });
            onSuccess?.("Booking updated successfully!");
            onClose();
        } catch (err) {
            form.setError("root", {
                type: "server",
                message: err?.response?.data?.message || "Update failed",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/60 bg-background/80 backdrop-blur-xl">
                <DialogHeader className="border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl">
                                Edit Booking
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update the booking details and save your changes
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground text-sm">
                                Loading booking details...
                            </p>
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 py-6"
                        >
                            {/* Address */}
                            <FormField
                                control={form.control}
                                name="address_id"
                                rules={{ required: "Address is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">
                                            Service Location
                                        </FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-lg bg-muted/40 border-border/60 h-10">
                                                    <SelectValue placeholder="Select address" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {addresses?.map((addr) => (
                                                    <SelectItem
                                                        key={addr.id}
                                                        value={String(addr.id)}
                                                    >
                                                        {addr.street_address},{" "}
                                                        {addr.city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Date & Time */}
                            <FormField
                                control={form.control}
                                name="scheduled_at"
                                rules={{ required: "Date & time is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">
                                            Date & Time
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="datetime-local"
                                                    className="pl-10 rounded-lg bg-muted/40 border-border/60 h-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Services */}
                            <FormField
                                control={form.control}
                                name="service_ids"
                                rules={{
                                    validate: (v) =>
                                        (v && v.length > 0) ||
                                        "Select at least one service",
                                }}
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">
                                            Services
                                        </FormLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {services.map((service) => {
                                                const checked =
                                                    serviceIds?.includes(
                                                        service.id
                                                    );
                                                return (
                                                    <FormControl
                                                        key={service.id}
                                                    >
                                                        <label
                                                            className={`flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                                                                checked
                                                                    ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/50"
                                                                    : "border-border/60 bg-background/50 hover:border-primary/30"
                                                            }`}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    checked
                                                                }
                                                                onCheckedChange={(
                                                                    value
                                                                ) => {
                                                                    const current =
                                                                        form.getValues(
                                                                            "service_ids"
                                                                        ) || [];
                                                                    if (value) {
                                                                        form.setValue(
                                                                            "service_ids",
                                                                            [
                                                                                ...current,
                                                                                service.id,
                                                                            ]
                                                                        );
                                                                    } else {
                                                                        form.setValue(
                                                                            "service_ids",
                                                                            current.filter(
                                                                                (
                                                                                    id
                                                                                ) =>
                                                                                    id !==
                                                                                    service.id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-foreground">
                                                                    {
                                                                        service.name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    Description:{" "}
                                                                    {service.description ||
                                                                        "No description"}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className={`ml-auto font-bold text-sm border-border/60 ${
                                                                    checked
                                                                        ? "bg-primary/10 text-primary"
                                                                        : ""
                                                                }`}
                                                            >
                                                                $
                                                                {
                                                                    service.base_price
                                                                }
                                                            </Badge>
                                                        </label>
                                                    </FormControl>
                                                );
                                            })}
                                        </div>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Notes */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">
                                            Special Instructions (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={3}
                                                placeholder="Extra details for the sweepstar..."
                                                className="resize-none rounded-lg bg-muted/40 border-border/60"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Total */}
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-4 rounded-xl border border-primary/20 dark:border-primary/30">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Estimated Total
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {serviceIds?.length} service
                                            {serviceIds?.length !== 1
                                                ? "s"
                                                : ""}{" "}
                                            selected
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                                        <DollarSign className="w-6 h-6" />
                                        {total.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Form Error */}
                            {form.formState.errors.root && (
                                <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                        {form.formState.errors.root.message}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <DialogFooter className="pt-4 border-t border-border/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isPending}
                                    className="rounded-lg border-border/60"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all gap-2 font-semibold"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
