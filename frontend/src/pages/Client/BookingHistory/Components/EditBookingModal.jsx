// src/pages/booking/Components/EditBookingModal.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    Sparkles,
    Check,
    MessageSquare,
    Calendar,
    Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServices } from "@/Hooks/useServices";
import { useAddress } from "@/Hooks/useAddress";
import { useEditBooking } from "@/Hooks/useBookings";
import { toast } from "sonner";

const roundToHalf = (num) => Math.round(num * 2) / 2;

const formatDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "0h 00min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}min`;
};

const toNumArray = (arr) =>
    Array.isArray(arr)
        ? arr.map((v) => Number(v)).filter((v) => !Number.isNaN(v))
        : [];

export default function EditBookingModal({
    booking,
    isOpen,
    onClose,
    onSuccess,
}) {
    const { data: services = [], isLoading: loadingServices } = useServices();
    const { addresses: addressData, loading: loadingAddresses } = useAddress();
    const { mutate: updateBooking, isPending } = useEditBooking();

    const verifiedAddresses = useMemo(() => {
        if (Array.isArray(addressData)) return addressData;
        if (addressData?.data && Array.isArray(addressData.data))
            return addressData.data;
        return [];
    }, [addressData]);

    const bookingService = booking?.booking_services?.[0];

    const [priceMultiplier, setPriceMultiplier] = useState(
        booking?.price_multiplier || 1.0,
    );

    // Group options same way backend uses option_group_name
    const buildGroupedOptions = (service) => {
        if (!service?.options) return {};
        return service.options.reduce((acc, opt) => {
            const group = opt.option_group_name || "General";
            if (!acc[group]) acc[group] = [];
            acc[group].push(opt);
            return acc;
        }, {});
    };

    // ✅ Client-side validation matches backend: exactly 1 option per group
    const getBookingSchema = (currentService) => {
        const grouped = buildGroupedOptions(currentService);

        const base = z.object({
            service_id: z.number({ required_error: "Please select a service" }),
            address_id: z.string().min(1, "Please select an address"),
            scheduled_at: z.string().min(1, "Please select date and time"),
            options: z.array(z.number()).default([]),
            extras: z.array(z.number()).default([]),
            notes: z.string().optional(),
            final_price: z.number(),
        });

        if (!currentService?.options?.length) return base;

        return base.superRefine((val, ctx) => {
            const selected = new Set(val.options || []);
            for (const [groupName, opts] of Object.entries(grouped)) {
                const groupIds = opts.map((o) => o.id);
                const count = groupIds.filter((id) => selected.has(id)).length;
                if (count !== 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["options"],
                        message: `Please select exactly one choice for "${groupName}".`,
                    });
                }
            }
        });
    };

    const form = useForm({
        resolver: (values, context, options) => {
            const currentService = services.find(
                (s) => s.id === values.service_id,
            );
            const schema = getBookingSchema(currentService);
            return zodResolver(schema)(values, context, options);
        },
        defaultValues: {
            service_id: bookingService?.service_id ?? null,
            address_id: booking?.address_id ? String(booking.address_id) : "",
            scheduled_at: booking?.scheduled_at
                ? booking.scheduled_at.substring(0, 16)
                : "",

            // ✅ FIX: Backend stores service_option_id / service_extra_id
            options:
                bookingService?.selected_options?.map((o) =>
                    Number(o.service_option_id),
                ) || [],
            extras:
                bookingService?.selected_extras?.map((e) =>
                    Number(e.service_extra_id),
                ) || [],

            notes: booking?.notes || "",
            final_price: booking?.total_price || 0,
        },
        mode: "onSubmit",
        shouldUnregister: false,
    });

    const {
        watch,
        setValue,
        reset,
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    // ✅ Reset correctly when opening modal for a booking
    useEffect(() => {
        if (!booking) return;

        const bs = booking?.booking_services?.[0];

        reset({
            service_id: bs?.service_id ?? null,
            address_id: booking?.address_id ? String(booking.address_id) : "",
            scheduled_at: booking?.scheduled_at
                ? booking.scheduled_at.substring(0, 16)
                : "",

            // ✅ FIX
            options:
                bs?.selected_options?.map((o) => Number(o.service_option_id)) ||
                [],
            extras:
                bs?.selected_extras?.map((e) => Number(e.service_extra_id)) ||
                [],

            notes: booking?.notes || "",
            final_price: booking?.total_price || 0,
        });

        setPriceMultiplier(booking?.price_multiplier || 1.0);
    }, [booking, reset]);

    const selectedServiceId = watch("service_id");
    const selectedOptions = toNumArray(watch("options") || []);
    const selectedExtras = toNumArray(watch("extras") || []);

    const currentService = useMemo(
        () => services.find((s) => s.id === selectedServiceId),
        [services, selectedServiceId],
    );

    const groupedOptions = useMemo(
        () => buildGroupedOptions(currentService),
        [currentService],
    );

    const totals = useMemo(() => {
        if (!currentService) return { finalPrice: 0, durationMinutes: 0 };

        let price = Number(currentService.base_price || 0);
        let duration = Number(currentService.base_duration_minutes || 0);

        selectedOptions.forEach((optId) => {
            const opt = currentService.options?.find((o) => o.id === optId);
            if (opt) {
                price += Number(opt.option_price || 0);
                duration += Number(opt.duration_minutes || 0);
            }
        });

        selectedExtras.forEach((extraId) => {
            const extra = currentService.extras?.find((e) => e.id === extraId);
            if (extra) {
                price += Number(extra.extra_price || 0);
                duration += Number(extra.duration_minutes || 0);
            }
        });

        const finalPrice = roundToHalf(price * priceMultiplier);
        return { finalPrice, durationMinutes: duration };
    }, [currentService, selectedOptions, selectedExtras, priceMultiplier]);

    useEffect(() => {
        setValue("final_price", totals.finalPrice, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [totals.finalPrice, setValue]);

    const handleOptionSelect = (groupName, optionId) => {
        const groupOptionIds =
            groupedOptions[groupName]?.map((o) => o.id) || [];
        const otherGroups = selectedOptions.filter(
            (id) => !groupOptionIds.includes(id),
        );

        setValue("options", [...otherGroups, optionId], {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const toggleExtra = (extraId) => {
        const isSelected = selectedExtras.includes(extraId);
        const next = isSelected
            ? selectedExtras.filter((id) => id !== extraId)
            : [...selectedExtras, extraId];

        setValue("extras", next, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onSubmit = (formData) => {
        const payload = {
            // We send service_id always (backend recalculates snapshot)
            service_id: Number(formData.service_id),
            address_id: Number(formData.address_id),
            scheduled_at: formData.scheduled_at,
            options: toNumArray(formData.options),
            extras: toNumArray(formData.extras),
            final_price: Number(formData.final_price),
            notes: formData.notes || "",
        };

        updateBooking(
            { id: booking.id, data: payload },
            {
                onSuccess: () => {
                    onSuccess("Booking updated successfully!");
                    onClose();
                },
                onError: (error) => {
                    console.error("Update error:", error);
                    toast.error(
                        error.response?.data?.message ||
                            error.response?.data?.errors?.options?.[0] ||
                            error.response?.data?.errors?.final_price?.[0] ||
                            "Failed to update booking",
                    );
                },
            },
        );
    };

    const onInvalid = (errs) => {
        console.log("Form validation errors:", errs);
        toast.error("Please fix the highlighted fields before saving.");
    };

    const isLoading = loadingServices || loadingAddresses;

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Loading</DialogTitle>
                        <DialogDescription>Loading booking…</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 h-[90vh]">
                {/* ✅ Accessibility: title + description exist */}
                <DialogHeader className="p-6 border-b shrink-0">
                    <DialogTitle className="sr-only">Edit Booking</DialogTitle>
                    <DialogDescription className="sr-only">
                        Modify your service, location, options, and schedule.
                    </DialogDescription>

                    {/* Visible header */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Pencil className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Edit Booking</h2>
                            <p className="text-sm text-muted-foreground">
                                Modify your service, location, options, and
                                schedule.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit, onInvalid)}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        {/* keep fields registered */}
                        <input
                            type="hidden"
                            {...register("final_price", {
                                valueAsNumber: true,
                            })}
                        />

                        <ScrollArea className="flex-1 p-2 h-[1px]">
                            <div className="p-6 space-y-8">
                                {/* 1. Service */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {services.map((s) => (
                                        <Button
                                            key={s.id}
                                            type="button"
                                            variant={
                                                selectedServiceId === s.id
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="h-24 flex flex-col gap-1 border-2"
                                            onClick={() => {
                                                setValue("service_id", s.id, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });

                                                // If service changed, clear options/extras (user must re-pick)
                                                if (
                                                    selectedServiceId !== s.id
                                                ) {
                                                    setValue("options", [], {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    });
                                                    setValue("extras", [], {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    });
                                                }
                                            }}
                                        >
                                            <span className="font-bold text-base">
                                                {s.name}
                                            </span>
                                        </Button>
                                    ))}
                                </div>

                                {currentService && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                        {/* 2. Options */}
                                        {Object.keys(groupedOptions).length >
                                            0 && (
                                            <div className="space-y-2">
                                                {Object.entries(
                                                    groupedOptions,
                                                ).map(([groupName, opts]) => (
                                                    <div
                                                        key={groupName}
                                                        className="space-y-3"
                                                    >
                                                        <label className="text-sm font-semibold uppercase tracking-wider text-primary">
                                                            {groupName}
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {opts.map((opt) => (
                                                                <Button
                                                                    key={opt.id}
                                                                    type="button"
                                                                    variant={
                                                                        selectedOptions.includes(
                                                                            opt.id,
                                                                        )
                                                                            ? "default"
                                                                            : "outline"
                                                                    }
                                                                    onClick={() =>
                                                                        handleOptionSelect(
                                                                            groupName,
                                                                            opt.id,
                                                                        )
                                                                    }
                                                                    className="rounded-full px-6"
                                                                >
                                                                    {opt.name}
                                                                    {selectedOptions.includes(
                                                                        opt.id,
                                                                    ) && (
                                                                        <Check className="ml-2 w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                {errors?.options?.message && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.options.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* 3. Extras */}
                                        {currentService.extras?.length > 0 && (
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold uppercase tracking-wider text-primary">
                                                    Extra Tasks
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {currentService.extras.map(
                                                        (extra) => {
                                                            const isSelected =
                                                                selectedExtras.includes(
                                                                    extra.id,
                                                                );
                                                            return (
                                                                <Button
                                                                    key={
                                                                        extra.id
                                                                    }
                                                                    type="button"
                                                                    variant={
                                                                        isSelected
                                                                            ? "default"
                                                                            : "outline"
                                                                    }
                                                                    className="justify-between h-14"
                                                                    onClick={() =>
                                                                        toggleExtra(
                                                                            extra.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="truncate mr-2">
                                                                        {
                                                                            extra.name
                                                                        }
                                                                    </span>
                                                                    {isSelected && (
                                                                        <Check className="w-4 h-4 shrink-0" />
                                                                    )}
                                                                </Button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. Location & Date */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={control}
                                                name="address_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Location
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select address" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {verifiedAddresses.map(
                                                                    (a) => (
                                                                        <SelectItem
                                                                            key={
                                                                                a.id
                                                                            }
                                                                            value={String(
                                                                                a.id,
                                                                            )}
                                                                        >
                                                                            {`${a.city}, ${a.street_address}`}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={control}
                                                name="scheduled_at"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            Schedule Date & Time
                                                        </FormLabel>
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
                                        </div>

                                        {/* 5. Notes */}
                                        <FormField
                                            control={control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <MessageSquare className="w-4 h-4" />
                                                        Notes
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Any special instructions?"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* 6. Pricing */}
                                        <Card className="bg-primary/5 border-primary/20">
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Estimated Duration
                                                        </p>
                                                        <p className="text-2xl font-bold">
                                                            {formatDuration(
                                                                totals.durationMinutes,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">
                                                            Revised Total
                                                        </p>
                                                        <p className="text-4xl font-black text-primary">
                                                            $
                                                            {totals.finalPrice.toFixed(
                                                                2,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Price Adjustment
                                                        </span>
                                                        <span className="font-medium">
                                                            {priceMultiplier.toFixed(
                                                                2,
                                                            )}
                                                            x
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        min={0.9}
                                                        max={1.5}
                                                        step={0.05}
                                                        value={[
                                                            priceMultiplier,
                                                        ]}
                                                        onValueChange={([
                                                            val,
                                                        ]) =>
                                                            setPriceMultiplier(
                                                                val,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <DialogFooter className="p-4 border-t shrink-0">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !selectedServiceId}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="mr-2" />
                                )}
                                {isPending ? "Saving..." : "Update Booking"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
