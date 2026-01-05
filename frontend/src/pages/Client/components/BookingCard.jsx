import React from "react";
import { format } from "date-fns";
import { XCircle, Calendar, Clock, MapPin, Pencil, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// --- Helpers ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

// IMPROVED STYLES: Using specific text colors for better visibility
const STATUS_STYLES = {
    completed:
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
    pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
};

export default function BookingCard({
    booking,
    onEdit,
    onReviewAction,
    onCancel,
}) {
    // Safety check
    if (!booking) return null;

    // Normalize status to lowercase to ensure matching
    const statusKey = booking.status?.toLowerCase() || "pending";

    // Logic: User can Cancel if status is pending or confirmed
    const canCancel = ["pending", "confirmed"].includes(statusKey);

    // Logic: User can edit if status is NOT completed, cancelled, or in_progress
    const isEditable = !["completed", "cancelled", "in_progress"].includes(
        statusKey
    );

    // Get color or fallback
    const badgeColor = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;

    const hasReview = !!booking.review;

    // Helper to list service names safely
    const serviceNames =
        booking.services?.map((s) => s.name).join(", ") || "Cleaning Service";

    return (
        <Card className="group hover:shadow-md transition-all duration-200 border-muted/60">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Side: Info */}
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-foreground line-clamp-1">
                                {serviceNames}
                            </h3>
                            {/* FIXED BADGE */}
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${badgeColor}`}
                            >
                                {booking.status || "Unknown"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {booking.scheduled_at
                                    ? format(
                                          new Date(booking.scheduled_at),
                                          "PPP"
                                      )
                                    : "No Date"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {booking.scheduled_at
                                    ? format(
                                          new Date(booking.scheduled_at),
                                          "p"
                                      )
                                    : "No Time"}
                            </span>
                            {booking.address && (
                                <span className="flex items-center gap-2 sm:col-span-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {booking.address.street_address},{" "}
                                    {booking.address.city}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Price & Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-2 min-w-[120px]">
                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(booking.total_price)}
                        </span>

                        {isEditable && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(booking)}
                            >
                                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                            </Button>
                        )}

                        {/* CANCEL BUTTON (Added this block) */}
                        {canCancel && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100"
                                onClick={() => onCancel(booking)}
                            >
                                <XCircle className="w-3.5 h-3.5 mr-2" /> Cancel
                            </Button>
                        )}

                        {statusKey === "completed" && (
                            <Button
                                variant={hasReview ? "secondary" : "outline"}
                                size="sm"
                                className={`w-full md:w-auto ${
                                    hasReview
                                        ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                        : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                                }`}
                                onClick={() => onReviewAction(booking)}
                            >
                                <Star
                                    className={`w-3.5 h-3.5 mr-2 ${
                                        hasReview
                                            ? "fill-green-700"
                                            : "fill-yellow-600"
                                    }`}
                                />
                                {hasReview ? "My Review" : "Rate"}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
