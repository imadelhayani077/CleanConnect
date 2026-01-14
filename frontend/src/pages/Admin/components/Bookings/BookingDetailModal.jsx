// src/components/booking/BookingDetailsDialog.jsx
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, AlertTriangle, MapPin, Clock } from "lucide-react";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString));
};

export default function BookingDetailModal({ booking, open, onClose }) {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-border/60 bg-background/80 backdrop-blur-xl">
                {/* Header */}
                <DialogHeader className="p-6 border-b border-border/60 bg-gradient-to-r from-background to-muted/30">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                Booking Details
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Reference #{booking.id}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {booking && (
                        <div className="space-y-6">
                            {/* Cancellation Alert */}
                            {booking.status === "cancelled" && (
                                <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <AlertDescription className="text-red-800 dark:text-red-300">
                                        <span className="font-semibold">
                                            Booking Cancelled
                                        </span>
                                        {" - "}
                                        {booking.cancellation_reason ||
                                            "No reason provided"}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Client Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Client Information
                                    </h4>
                                    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {booking.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {booking.user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {booking.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sweepstar Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Assigned Sweepstar
                                    </h4>
                                    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100/60 dark:bg-blue-900/20 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                                                {booking.sweepstar
                                                    ? booking.sweepstar.name?.charAt(
                                                          0
                                                      )
                                                    : "?"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {booking.sweepstar
                                                        ? booking.sweepstar.name
                                                        : "Not Assigned"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {booking.sweepstar
                                                        ? booking.sweepstar
                                                              .email
                                                        : "Waiting for assignment"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Services */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                    Services Requested
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {booking.services &&
                                    booking.services.length > 0 ? (
                                        booking.services.map((s, i) => (
                                            <Badge
                                                key={i}
                                                className="bg-purple-100/60 text-purple-700 border-purple-200/60 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/60"
                                            >
                                                {s.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No specific services listed
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Location & Time */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Location
                                    </h4>
                                    <p className="text-sm text-foreground flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <span>
                                            {booking.address?.street_address ||
                                                "N/A"}
                                            , {booking.address?.city}
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Scheduled Date & Time
                                    </h4>
                                    <p className="text-sm text-foreground flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {formatDate(booking.scheduled_at)}
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
