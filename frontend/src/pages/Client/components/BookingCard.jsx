// src/components/booking/BookingCard.jsx
import React from "react";
import { format } from "date-fns";
import {
    XCircle,
    Calendar,
    Clock,
    MapPin,
    Pencil,
    Star,
    CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const STATUS_STYLES = {
    completed:
        "bg-emerald-100/60 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60",
    confirmed:
        "bg-blue-100/60 text-blue-700 border-blue-200/60 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60",
    cancelled:
        "bg-red-100/60 text-red-700 border-red-200/60 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/60",
    pending:
        "bg-amber-100/60 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60",
};

export default function BookingCard({
    booking,
    onEdit,
    onReviewAction,
    onCancel,
}) {
    if (!booking) return null;

    const statusKey = booking.status?.toLowerCase() || "pending";
    const canCancel = ["pending", "confirmed"].includes(statusKey);
    const isEditable = !["completed", "cancelled", "in_progress"].includes(
        statusKey
    );
    const badgeColor = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
    const hasReview = !!booking.review;
    const serviceNames =
        booking.services?.map((s) => s.name).join(", ") || "Cleaning Service";

    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm group hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden">
            {/* Accent Bar */}
            <div
                className={`h-1 bg-gradient-to-r ${
                    statusKey === "completed"
                        ? "from-emerald-500 to-emerald-400"
                        : statusKey === "confirmed"
                        ? "from-blue-500 to-blue-400"
                        : statusKey === "cancelled"
                        ? "from-red-500 to-red-400"
                        : "from-amber-500 to-amber-400"
                }`}
            />

            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left Side: Info */}
                    <div className="flex-1 space-y-4">
                        {/* Title & Status */}
                        <div className="flex items-start gap-3 flex-wrap">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-foreground line-clamp-1">
                                    {serviceNames}
                                </h3>
                            </div>
                            <Badge
                                variant="outline"
                                className={`text-xs font-semibold border uppercase tracking-wider ${badgeColor}`}
                            >
                                {booking.status || "Unknown"}
                            </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Date
                                    </p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">
                                        {booking.scheduled_at
                                            ? format(
                                                  new Date(
                                                      booking.scheduled_at
                                                  ),
                                                  "MMM dd, yyyy"
                                              )
                                            : "No Date"}
                                    </p>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Time
                                    </p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">
                                        {booking.scheduled_at
                                            ? format(
                                                  new Date(
                                                      booking.scheduled_at
                                                  ),
                                                  "h:mm a"
                                              )
                                            : "No Time"}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            {booking.address && (
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Location
                                        </p>
                                        <p className="text-sm font-medium text-foreground mt-0.5">
                                            {booking.address.street_address},{" "}
                                            {booking.address.city}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Price & Actions */}
                    <div className="flex flex-col items-end gap-4 min-w-fit">
                        {/* Price */}
                        <div className="text-right">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Total
                            </p>
                            <p className="text-2xl font-bold text-primary mt-1">
                                {formatCurrency(booking.total_price)}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            {isEditable && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg border-border/60 hover:bg-muted/50 gap-2 text-xs font-semibold"
                                    onClick={() => onEdit(booking)}
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit
                                </Button>
                            )}

                            {canCancel && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20 rounded-lg gap-2 text-xs font-semibold"
                                    onClick={() => onCancel(booking)}
                                >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Cancel
                                </Button>
                            )}

                            {statusKey === "completed" && (
                                <Button
                                    variant={hasReview ? "default" : "outline"}
                                    size="sm"
                                    className={`rounded-lg gap-2 text-xs font-semibold ${
                                        hasReview
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            : "border-border/60 hover:bg-muted/50"
                                    }`}
                                    onClick={() => onReviewAction(booking)}
                                >
                                    <Star
                                        className={`w-3.5 h-3.5 ${
                                            hasReview ? "fill-current" : ""
                                        }`}
                                    />
                                    {hasReview ? "My Review" : "Rate"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
