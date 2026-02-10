import React, { useMemo } from "react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Calendar,
    Sparkles,
    DollarSign,
    ShieldCheck,
    Clock,
    Briefcase,
    CheckCircle2,
    Timer,
} from "lucide-react";
import { getAvatarUrl, getInitials } from "@/utils/avatarHelper";

const formatDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "0h 00min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}min`;
};

export default function BookingDetailModal({ booking, open, onClose }) {
    if (!booking) return null;

    const bookingService = booking.booking_services?.[0];
    const scheduledDate = booking.scheduled_at
        ? new Date(booking.scheduled_at)
        : new Date();

    // Group options by option_group_name
    const groupedOptions = useMemo(() => {
        if (!bookingService?.selected_options) return {};
        return bookingService.selected_options.reduce((acc, item) => {
            const group = item.option?.option_group_name || "General";
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
        }, {});
    }, [bookingService]);

    const statusKey = booking.status?.toLowerCase() || "pending";
    const THEMES = {
        completed: "bg-emerald-500 text-white",
        confirmed: "bg-blue-500 text-white",
        cancelled: "bg-red-500 text-white",
        pending: "bg-amber-500 text-white",
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 h-[90vh]">
                {/* Header with status */}
                <DialogHeader className="p-6 border-b shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    Booking Details
                                </DialogTitle>
                                <DialogDescription>
                                    #{booking.id} •{" "}
                                    {format(scheduledDate, "MMM d, yyyy")}
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge
                            className={`${THEMES[statusKey] || THEMES.pending} capitalize`}
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                    When
                                </p>
                                <div className="flex items-center gap-2 text-lg font-bold">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    {format(
                                        scheduledDate,
                                        "EEEE, MMMM d, yyyy",
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Clock className="w-4 h-4" />
                                    {format(scheduledDate, "h:mm a")}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                    Where
                                </p>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-bold">
                                            {booking.address?.street_address}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.address?.city},{" "}
                                            {booking.address?.state}{" "}
                                            {booking.address?.zip_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Duration Card */}
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Timer className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">
                                        Total Duration
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatDuration(
                                            bookingService.total_duration_minutes,
                                        )}
                                    </p>
                                </div>
                            </div>
                            {booking.price_multiplier &&
                                booking.price_multiplier !== 1.0 && (
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                            Price Multiplier
                                        </p>
                                        <p className="text-lg font-bold text-primary">
                                            {booking.price_multiplier.toFixed(
                                                2,
                                            )}
                                            x
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>

                    <Separator />

                    {/* Service Breakdown */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="w-5 h-5" />
                            <h3 className="text-lg font-bold">
                                Service Breakdown
                            </h3>
                        </div>

                        {/* Main Service */}
                        {bookingService?.service && (
                            <div className="bg-muted/20 p-4 rounded-xl border">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-lg">
                                            {bookingService.service.name}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        {Object.keys(groupedOptions).length > 0 && (
                            <Accordion
                                type="single"
                                collapsible
                                defaultValue="options"
                                className="w-full"
                            >
                                <AccordionItem
                                    value="options"
                                    className="border rounded-xl px-4"
                                >
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-primary" />
                                            <span className="font-bold">
                                                Selected Options
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="ml-2"
                                            >
                                                {
                                                    Object.values(
                                                        groupedOptions,
                                                    ).flat().length
                                                }
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4 space-y-4">
                                        {Object.entries(groupedOptions).map(
                                            ([groupName, items]) => (
                                                <div
                                                    key={groupName}
                                                    className="space-y-2"
                                                >
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        {groupName}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="flex justify-between items-center p-3 bg-background rounded-lg border"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                    <div>
                                                                        <span className="font-medium">
                                                                            {
                                                                                item
                                                                                    .option
                                                                                    ?.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}

                        {/* Extra Tasks */}
                        {bookingService?.selected_extras?.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Extra Tasks
                                </h4>
                                <div className="grid gap-3">
                                    {bookingService.selected_extras.map(
                                        (extra) => (
                                            <div
                                                key={extra.id}
                                                className="flex justify-between items-center p-4 border border-dashed rounded-xl bg-card"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                                    </div>

                                                    <p className="font-medium">
                                                        {extra.extra?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total Price */}
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-primary" />
                                <span className="text-lg font-bold">
                                    Total Amount
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-primary">
                                    $
                                    {parseFloat(booking.total_price).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                Special Instructions
                            </h4>
                            <div className="p-4 bg-muted/20 rounded-xl border">
                                <p className="whitespace-pre-line">
                                    {booking.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Sweepstar */}
                    {booking.sweepstar && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                Assigned Sweepstar
                            </h4>
                            <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border">
                                <Avatar className="h-14 w-14 ring-4 ring-primary/10">
                                    <AvatarImage
                                        src={getAvatarUrl(
                                            booking.sweepstar.avatar,
                                        )}
                                    />
                                    <AvatarFallback>
                                        {getInitials(booking.sweepstar.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">
                                        {booking.sweepstar.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        Verified Professional
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
