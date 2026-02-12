import React, { useMemo } from "react";
import { format } from "date-fns";
import {
    XCircle,
    Clock,
    MapPin,
    Pencil,
    Star,
    Briefcase,
    DollarSign,
    FileText,
    Sparkles,
    Plus,
    Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount || 0));

const safeArr = (v) => (Array.isArray(v) ? v : []);

const pickTheme = (statusKey) => {
    const THEMES = {
        completed: {
            border: "from-emerald-500 via-emerald-400 to-emerald-300",
            badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
            iconBg: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400",
            cardBorder: "border-emerald-200/50 dark:border-emerald-900/20",
        },
        confirmed: {
            border: "from-blue-500 via-blue-400 to-blue-300",
            badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            iconBg: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
            cardBorder: "border-blue-200/50 dark:border-blue-900/20",
        },
        cancelled: {
            border: "from-red-500 via-red-400 to-red-300",
            badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            iconBg: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400",
            cardBorder: "border-red-200/50 dark:border-red-900/20 opacity-90",
        },
        pending: {
            border: "from-amber-500 via-amber-400 to-amber-300",
            badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
            iconBg: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400",
            cardBorder: "border-amber-200/50 dark:border-amber-900/20",
        },
        in_progress: {
            border: "from-violet-500 via-violet-400 to-violet-300",
            badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
            iconBg: "bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400",
            cardBorder: "border-violet-200/50 dark:border-violet-900/20",
        },
    };

    return THEMES[statusKey] || THEMES.pending;
};

export default function BookingCard({
    booking,
    onEdit,
    onReviewAction,
    onCancel,
    onViewDetails,
}) {
    if (!booking) return null;

    const statusKey = booking.status?.toLowerCase() || "pending";
    const canCancel = ["pending", "confirmed"].includes(statusKey);
    const isEditable = !["completed", "cancelled", "in_progress"].includes(
        statusKey,
    );
    const hasReview = !!booking.review;

    const scheduledDate = booking.scheduled_at
        ? new Date(booking.scheduled_at)
        : new Date();

    // ---- Service + options + extras (supports multiple possible API shapes) ----
    const bookingService = booking?.booking_services?.[0] || null;

    const serviceNames =
        safeArr(booking.services)
            ?.map((s) => s?.name)
            .filter(Boolean)
            .join(", ") ||
        bookingService?.service?.name ||
        "Cleaning Service";

    const selectedOptions = useMemo(() => {
        // Possible shapes:
        // - booking.booking_services[0].selected_options => [{ service_option: { name } }, { option: { name } }, { name }]
        // - booking.booking_services[0].options => ...
        const raw =
            bookingService?.selected_options ||
            bookingService?.options ||
            bookingService?.booking_service_options ||
            [];
        return safeArr(raw)
            .map((o) => o?.service_option?.name || o?.option?.name || o?.name)
            .filter(Boolean);
    }, [bookingService]);

    const selectedExtras = useMemo(() => {
        const raw =
            bookingService?.selected_extras ||
            bookingService?.extras ||
            bookingService?.booking_service_extras ||
            [];
        return safeArr(raw)
            .map((e) => e?.service_extra?.name || e?.extra?.name || e?.name)
            .filter(Boolean);
    }, [bookingService]);

    const theme = pickTheme(statusKey);

    const topOptions = selectedOptions.slice(0, 3);
    const moreOptionsCount = Math.max(
        0,
        selectedOptions.length - topOptions.length,
    );

    const topExtras = selectedExtras.slice(0, 3);
    const moreExtrasCount = Math.max(
        0,
        selectedExtras.length - topExtras.length,
    );

    return (
        <Card
            className={[
                "group relative overflow-hidden transition-all",
                "hover:shadow-xl hover:-translate-y-0.5",
                "border bg-card h-full flex flex-col",
                theme.cardBorder,
            ].join(" ")}
        >
            {/* Accent */}
            <div className={`h-1.5 bg-gradient-to-r ${theme.border}`} />

            {/* Status badge */}
            <div className="absolute top-4 right-4">
                <Badge
                    className={`${theme.badge} shadow-sm border-0 capitalize`}
                >
                    {booking.status}
                </Badge>
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    <div
                        className={`p-3 rounded-2xl ${theme.iconBg} shadow-sm`}
                    >
                        <Briefcase className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-lg md:text-xl line-clamp-1 pr-16">
                            {serviceNames}
                        </CardTitle>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-medium text-foreground/80">
                                    {format(scheduledDate, "EEE, MMM d")} •{" "}
                                    {format(scheduledDate, "h:mm a")}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-5 flex-1 flex flex-col">
                {/* Address */}
                {booking.address && (
                    <div className="flex items-start gap-2 p-2 rounded-xl bg-muted/20 border border-muted/50 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                            {`${booking.address?.city} | ${booking.address.street_address}`}
                            {/* {booking.address.street_address} |
                            {booking.address?.city} */}
                        </span>
                    </div>
                )}

                {/* Options + Extras */}
                {(selectedOptions.length > 0 || selectedExtras.length > 0) && (
                    <div className="grid gap-3">
                        {/* Options */}
                        {selectedOptions.length > 0 && (
                            <div className="rounded-2xl border bg-muted/10 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <Layers3 className="w-4 h-4 text-primary" />
                                        Options
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="font-medium"
                                    >
                                        {selectedOptions.length}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {topOptions.map((name) => (
                                        <span
                                            key={name}
                                            className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-foreground/80 shadow-sm"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                            <span className="max-w-[180px] truncate">
                                                {name}
                                            </span>
                                        </span>
                                    ))}

                                    {moreOptionsCount > 0 && (
                                        <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                                            +{moreOptionsCount} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Extras */}
                        {selectedExtras.length > 0 && (
                            <div className="rounded-2xl border bg-muted/10 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <Plus className="w-4 h-4 text-primary" />
                                        Extra Tasks
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="font-medium"
                                    >
                                        {selectedExtras.length}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {topExtras.map((name) => (
                                        <span
                                            key={name}
                                            className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-foreground/80 shadow-sm"
                                        >
                                            <Plus className="w-3.5 h-3.5 text-primary" />
                                            <span className="max-w-[180px] truncate">
                                                {name}
                                            </span>
                                        </span>
                                    ))}

                                    {moreExtrasCount > 0 && (
                                        <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                                            +{moreExtrasCount} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Total */}
                <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-2xl bg-muted/30 border border-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">
                                Total
                            </span>
                        </div>
                        <span className="text-lg font-bold text-foreground">
                            {formatCurrency(booking.total_price)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="grid gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onViewDetails?.(booking)}
                            className="w-full gap-2 rounded-xl"
                        >
                            <FileText className="w-4 h-4" /> View Details
                        </Button>

                        {isEditable && (
                            <Button
                                variant="outline"
                                onClick={() => onEdit?.(booking)}
                                className="w-full justify-center gap-2 rounded-xl"
                            >
                                <Pencil className="w-4 h-4" /> Edit
                            </Button>
                        )}

                        {statusKey === "completed" && (
                            <Button
                                variant={hasReview ? "secondary" : "default"}
                                onClick={() => onReviewAction?.(booking)}
                                className={[
                                    "w-full justify-center gap-2 rounded-xl",
                                    !hasReview &&
                                        "bg-emerald-600 hover:bg-emerald-700 text-white",
                                ].join(" ")}
                            >
                                <Star
                                    className={`w-4 h-4 ${hasReview ? "fill-current" : ""}`}
                                />
                                {hasReview ? "My Review" : "Rate Service"}
                            </Button>
                        )}

                        {canCancel && (
                            <Button
                                variant="ghost"
                                onClick={() => onCancel?.(booking)}
                                className="w-full justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                            >
                                <XCircle className="w-4 h-4" /> Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
