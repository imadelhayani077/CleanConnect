import React from "react";
import { format } from "date-fns";
import {
    XCircle,
    Calendar,
    Clock,
    MapPin,
    Pencil,
    Star,
    Briefcase,
    DollarSign,
    FileText, // <--- Icon for details
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

export default function BookingCard({
    booking,
    onEdit,
    onReviewAction,
    onCancel,
    onViewDetails, // <--- New Prop
}) {
    if (!booking) return null;

    const statusKey = booking.status?.toLowerCase() || "pending";
    const canCancel = ["pending", "confirmed"].includes(statusKey);
    const isEditable = !["completed", "cancelled", "in_progress"].includes(
        statusKey,
    );
    const hasReview = !!booking.review;
    const serviceNames =
        booking.services?.map((s) => s.name).join(", ") || "Cleaning Service";

    const scheduledDate = booking.scheduled_at
        ? new Date(booking.scheduled_at)
        : new Date();

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
    };

    const theme = THEMES[statusKey] || THEMES.pending;

    return (
        <Card
            className={`group relative overflow-hidden transition-all hover:shadow-lg border bg-card h-full flex flex-col ${theme.cardBorder}`}
        >
            <div className={`h-1.5 bg-gradient-to-r ${theme.border}`} />

            <div className="absolute top-4 right-4">
                <Badge
                    className={`${theme.badge} shadow-sm border-0 capitalize`}
                >
                    {booking.status}
                </Badge>
            </div>

            <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-xl ${theme.iconBg}`}>
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg md:text-xl line-clamp-1">
                            {serviceNames}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {booking.address?.city || "Unknown City"}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5 pb-5 flex-1 flex flex-col">
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border text-center flex flex-col justify-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">
                            {format(scheduledDate, "MMM")}
                        </p>
                        <p className="text-xl font-bold text-foreground">
                            {format(scheduledDate, "d")}
                        </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border flex items-center justify-between">
                            <span className="text-xs uppercase text-muted-foreground font-bold">
                                {format(scheduledDate, "EEEE")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {format(scheduledDate, "yyyy")}
                            </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium text-sm">
                                {format(scheduledDate, "h:mm a")}
                            </span>
                        </div>
                    </div>
                </div>

                {booking.address && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-muted/50 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                            {booking.address.street_address}
                        </span>
                    </div>
                )}

                <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-muted/50">
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

                    <div className="grid gap-2">
                        {/* VIEW DETAILS BUTTON - ALWAYS VISIBLE */}
                        <Button
                            variant="outline"
                            onClick={() => onViewDetails(booking)}
                            className="w-full gap-2"
                        >
                            <FileText className="w-4 h-4" /> View Details
                        </Button>

                        {isEditable && (
                            <Button
                                variant="outline"
                                onClick={() => onEdit(booking)}
                                className="w-full justify-center gap-2"
                            >
                                <Pencil className="w-4 h-4" /> Edit
                            </Button>
                        )}

                        {statusKey === "completed" && (
                            <Button
                                variant={hasReview ? "secondary" : "default"}
                                onClick={() => onReviewAction(booking)}
                                className={`w-full justify-center gap-2 ${!hasReview && "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
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
                                onClick={() => onCancel(booking)}
                                className="w-full justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
