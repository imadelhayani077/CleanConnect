import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    Sparkles,
    Clock,
    Check,
    MessageSquare,
    Calendar,
    DollarSign,
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
import { useEditBooking } from "@/Hooks/useBookings";
import { toast } from "sonner";

const roundToHalf = (num) => Math.round(num * 2) / 2;
const formatDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "0h 00min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}min`;
};

const bookingSchema = z.object({
    service_id: z.number({ required_error: "Please select a service" }),
    scheduled_at: z.string().min(1, "Please select date and time"),
    options: z.array(z.number()).min(1, "Please select required options"),
    extras: z.array(
        z.object({
            id: z.number(),
            quantity: z.number(),
        }),
    ),
    notes: z.string().optional(),
    final_price: z.number(),
});

export default function EditBookingModal({
    booking,
    isOpen,
    onClose,
    onSuccess,
}) {
    const { data: services = [], isLoading: loadingServices } = useServices();
    const { mutate: updateBooking, isPending } = useEditBooking();
    const [priceMultiplier, setPriceMultiplier] = useState(
        booking?.price_multiplier || 1.0,
    );

    // Extract booking service data
    const bookingService = booking?.booking_services?.[0];
    // console.log(booking);

    // Initialize form with existing booking data
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_id: bookingService?.service_id || null,
            scheduled_at: booking?.scheduled_at
                ? booking.scheduled_at.substring(0, 16)
                : "",
            options:
                bookingService?.selected_options?.map((opt) => opt.option_id) ||
                [],
            extras:
                bookingService?.selected_extras?.map((extra) => ({
                    id: extra.extra_id,
                    quantity: extra.quantity || 1,
                })) || [],
            notes: booking?.notes || "",
            final_price: booking?.total_price || 0,
        },
    });

    const {
        watch,
        setValue,
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    const selectedServiceId = watch("service_id");
    const selectedOptions = watch("options");
    const selectedExtras = watch("extras");

    const currentService = useMemo(
        () => services.find((s) => s.id === selectedServiceId),
        [services, selectedServiceId],
    );

    // Group options by option_group_name
    const groupedOptions = useMemo(() => {
        if (!currentService?.options) return {};
        return currentService.options.reduce((acc, opt) => {
            const group = opt.option_group_name || "General";
            if (!acc[group]) acc[group] = [];
            acc[group].push(opt);
            return acc;
        }, {});
    }, [currentService]);

    // Calculate totals
    const totals = useMemo(() => {
        if (!currentService) return { finalPrice: 0, durationMinutes: 0 };

        let price = Number(currentService.base_price || 0);
        let duration = Number(currentService.base_duration_minutes || 0);

        selectedOptions.forEach((optId) => {
            const opt = currentService.options.find((o) => o.id === optId);
            if (opt) {
                price += Number(opt.option_price || 0);
                duration += Number(opt.duration_minutes || 0);
            }
        });

        selectedExtras.forEach((item) => {
            const extra = currentService.extras.find((e) => e.id === item.id);
            if (extra) {
                price += Number(extra.extra_price || 0) * (item.quantity || 1);
                duration +=
                    Number(extra.duration_minutes || 0) * (item.quantity || 1);
            }
        });

        const finalPrice = roundToHalf(price * priceMultiplier);
        return { finalPrice, durationMinutes: duration };
    }, [currentService, selectedOptions, selectedExtras, priceMultiplier]);

    // Update final_price in form
    useEffect(() => {
        setValue("final_price", totals.finalPrice);
    }, [totals.finalPrice, setValue]);

    // Handle option selection (single per group)
    const handleOptionSelect = (groupName, optionId) => {
        const groupOptionIds = groupedOptions[groupName].map((o) => o.id);
        const otherGroupsOptions = selectedOptions.filter(
            (id) => !groupOptionIds.includes(id),
        );
        setValue("options", [...otherGroupsOptions, optionId]);
    };

    // Pre-select old selections when service changes
    useEffect(() => {
        if (currentService && bookingService) {
            // Only pre-select if it's the same service
            if (currentService.id === bookingService.service_id) {
                // Options
                const oldOptionIds =
                    bookingService.selected_options?.map(
                        (opt) => opt.option_id,
                    ) || [];
                setValue("options", oldOptionIds);

                // Extras
                const oldExtras =
                    bookingService.selected_extras?.map((extra) => ({
                        id: extra.extra_id,
                        quantity: extra.quantity || 1,
                    })) || [];
                setValue("extras", oldExtras);
            }
        }
    }, [currentService, bookingService, setValue]);

    const onSubmit = (formData) => {
        const payload = {
            service_id: Number(formData.service_id),
            scheduled_at: formData.scheduled_at,
            options: formData.options.map((id) => Number(id)),
            extras: formData.extras.map((e) => ({
                id: Number(e.id),
                quantity: Number(e.quantity || 1),
            })),
            final_price: Number(formData.final_price),
            notes: formData.notes || "",
            address_id: booking.address_id, // Keep original address
            price_multiplier: priceMultiplier,
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
                            "Failed to update booking",
                    );
                },
            },
        );
    };

    if (loadingServices) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
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
                <DialogHeader className="p-6 border-b shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Pencil className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                Edit Booking
                            </DialogTitle>
                            <DialogDescription>
                                Modify your service selection, options, and
                                schedule.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <ScrollArea className="flex-1 p-2 h-[1px]">
                            {/* h-[1px] forces viewport height */}
                            <div className="p-6 space-y-8">
                                {/* 1. Service Selection */}
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
                                                setValue("service_id", s.id);
                                                // Clear selections when changing service
                                                if (
                                                    selectedServiceId !== s.id
                                                ) {
                                                    setValue("options", []);
                                                    setValue("extras", []);
                                                }
                                            }}
                                        >
                                            <span className="font-bold text-base">
                                                {s.name}
                                            </span>
                                            {bookingService?.service_id ===
                                                s.id}
                                        </Button>
                                    ))}
                                </div>

                                {currentService && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                        {/* 2. Options Selection */}
                                        {/* {console.log(groupedOptions)} */}
                                        {Object.entries(groupedOptions).map(
                                            ([groupName, opts]) => (
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
                                                                {console.log(
                                                                    opt,
                                                                )}
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
                                            ),
                                        )}

                                        {/* 3. Extra Tasks */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold uppercase tracking-wider text-primary">
                                                Extra Tasks
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {currentService.extras?.map(
                                                    (extra) => {
                                                        const isSelected =
                                                            selectedExtras.some(
                                                                (e) =>
                                                                    e.id ===
                                                                    extra.id,
                                                            );
                                                        return (
                                                            <Button
                                                                key={extra.id}
                                                                type="button"
                                                                variant={
                                                                    isSelected
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                className="justify-between h-14"
                                                                onClick={() => {
                                                                    if (
                                                                        isSelected
                                                                    ) {
                                                                        setValue(
                                                                            "extras",
                                                                            selectedExtras.filter(
                                                                                (
                                                                                    e,
                                                                                ) =>
                                                                                    e.id !==
                                                                                    extra.id,
                                                                            ),
                                                                        );
                                                                    } else {
                                                                        setValue(
                                                                            "extras",
                                                                            [
                                                                                ...selectedExtras,
                                                                                {
                                                                                    id: extra.id,
                                                                                    quantity: 1,
                                                                                },
                                                                            ],
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <span className="truncate mr-2">
                                                                    {extra.name}
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

                                        {/* 4. Date & Time */}
                                        <div className="space-y-4">
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
                                        </div>

                                        {/* 6. Pricing Summary */}
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
