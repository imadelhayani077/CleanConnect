import React, { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";

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
            service_ids: [], // array of ids (numbers)
        },
    });

    // When booking or modal opens, reset form with existing booking values
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
                // let RHF show errors if you add rules, but we guard anyway
                return;
            }

            const payload = {
                scheduled_at: new Date(values.scheduled_at).toISOString(),
                notes: values.notes,
                address_id: parseInt(values.address_id, 10),
                service_ids: values.service_ids,
            };

            await updateBooking({ id: booking.id, data: payload });
            onSuccess?.("Booking updated successfully.");
            onClose();
        } catch (err) {
            // You can set form-level error via setError if desired
            form.setError("root", {
                type: "server",
                message: err?.response?.data?.message || "Update failed",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Booking</DialogTitle>
                    <DialogDescription>
                        Update the booking details and save your changes.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-6 py-4"
                        >
                            {/* Address */}
                            <FormField
                                control={form.control}
                                name="address_id"
                                rules={{ required: "Address is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date & time */}
                            <FormField
                                control={form.control}
                                name="scheduled_at"
                                rules={{ required: "Date & time is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & time</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormLabel>Services</FormLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {services.map((service) => {
                                                const checked =
                                                    serviceIds?.includes(
                                                        service.id
                                                    );
                                                return (
                                                    <FormControl
                                                        key={service.id}
                                                    >
                                                        <label className="flex items-center space-x-2 rounded-md border border-border/60 bg-background px-3 py-2 cursor-pointer">
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
                                                            <div className="flex flex-col text-sm">
                                                                <span className="font-medium">
                                                                    {
                                                                        service.name
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {
                                                                        service.base_price
                                                                    }{" "}
                                                                    MAD
                                                                </span>
                                                            </div>
                                                        </label>
                                                    </FormControl>
                                                );
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Notes */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes (optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={3}
                                                placeholder="Extra details for the sweepstar..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Total */}
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    Estimated total
                                </p>
                                <p className="text-lg font-semibold">
                                    {total.toFixed(2)} MAD
                                </p>
                            </div>

                            {/* Form-level error */}
                            {form.formState.errors.root && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.root.message}
                                </p>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
