// src/components/booking/BookingForm.jsx
import { useState, useMemo, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const roundToHalf = (num) => Math.round(num * 2) / 2;

const formatDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "0h 00min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}min`;
};

const bookingSchema = z.object({
    service_id: z.number({ required_error: "Please select a service" }),
    address_id: z.string().min(1, "Please select an address"),
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

export default function BookingForm({
    services,
    addresses,
    onSubmit,
    isSubmitting,
}) {
    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_id: null,
            address_id: addresses.length > 0 ? String(addresses[0].id) : "",
            scheduled_at: "",
            options: [],
            extras: [],
            notes: "",
            final_price: 0,
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
    const [priceMultiplier, setPriceMultiplier] = useState(1);

    const currentService = useMemo(
        () => services.find((s) => s.id === selectedServiceId),
        [services, selectedServiceId],
    );

    const groupedOptions = useMemo(() => {
        if (!currentService?.options) return {};
        return currentService.options.reduce((acc, opt) => {
            const group = opt.option_group_name || "General";
            if (!acc[group]) acc[group] = [];
            acc[group].push(opt);
            return acc;
        }, {});
    }, [currentService]);

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

    useEffect(() => {
        setValue("final_price", totals.finalPrice);
    }, [totals.finalPrice, setValue]);

    const handleOptionSelect = (groupName, optionId) => {
        const groupOptionIds = groupedOptions[groupName].map((o) => o.id);
        const otherGroupsOptions = selectedOptions.filter(
            (id) => !groupOptionIds.includes(id),
        );
        setValue("options", [...otherGroupsOptions, optionId]);
    };

    // This catches validation errors and prints them to your browser console
    const onInvalid = (errors) => {
        console.error("Form Validation Failed:", errors);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="space-y-8"
            >
                {/* 1. Services Grid */}
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
                                setValue("options", []);
                                setValue("extras", []);
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
                        {Object.entries(groupedOptions).map(
                            ([groupName, opts]) => (
                                <div key={groupName} className="space-y-3">
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
                                {currentService.extras?.map((extra) => {
                                    const isSelected = selectedExtras.some(
                                        (e) => e.id === extra.id,
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
                                                if (isSelected) {
                                                    setValue(
                                                        "extras",
                                                        selectedExtras.filter(
                                                            (e) =>
                                                                e.id !==
                                                                extra.id,
                                                        ),
                                                    );
                                                } else {
                                                    setValue("extras", [
                                                        ...selectedExtras,
                                                        {
                                                            id: extra.id,
                                                            quantity: 1,
                                                        },
                                                    ]);
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
                                })}
                            </div>
                        </div>

                        {/* 4. Date & Time Selection (CRUCIAL FIX) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={control}
                                name="address_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select address" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {addresses.map((a) => (
                                                    <SelectItem
                                                        key={a.id}
                                                        value={String(a.id)}
                                                    >
                                                        {`${a.city}, ${a.street_address}`}
                                                    </SelectItem>
                                                ))}
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
                                            <Calendar className="w-4 h-4" />{" "}
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

                        {/* 5. Optional Note */}
                        <FormField
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />{" "}
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

                        {/* 6. Pricing Summary */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-2xl font-bold">
                                        Estimated Time:{" "}
                                        {formatDuration(totals.durationMinutes)}
                                    </p>
                                    <p className="text-4xl font-black text-primary">
                                        Price: ${totals.finalPrice.toFixed(2)}
                                    </p>
                                </div>
                                <Slider
                                    min={0.9}
                                    max={1.5}
                                    step={0.05}
                                    value={[priceMultiplier]}
                                    onValueChange={([val]) =>
                                        setPriceMultiplier(val)
                                    }
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting || !selectedServiceId}
                    className="w-full h-16 text-xl font-bold"
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Sparkles className="mr-2" />
                    )}
                    {isSubmitting ? "Processing..." : "Book Now"}
                </Button>
            </form>
        </Form>
    );
}
