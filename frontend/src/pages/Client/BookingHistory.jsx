import React, { useState } from "react";

import { format } from "date-fns";
import {
    Calendar,
    MapPin,
    Clock,
    Pencil,
    Loader2,
    XCircle,
} from "lucide-react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useBooking } from "@/Helper/BookingContext";

export default function BookingHistory() {
    const { bookings, loading, editBooking } = useBooking();

    // Local State for Edit Modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    // Helper: Status Colors
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500 hover:bg-green-600 border-transparent";
            case "confirmed":
                return "bg-blue-500 hover:bg-blue-600 border-transparent";
            case "cancelled":
                return "bg-red-500 hover:bg-red-600 border-transparent";
            default:
                return "bg-yellow-500 hover:bg-yellow-600 border-transparent"; // pending
        }
    };

    // Handler: Open Edit Modal
    const handleEditClick = (booking) => {
        // 1. Convert DB date (YYYY-MM-DD HH:MM:SS) to Input format (YYYY-MM-DDTHH:MM)
        // This ensures the datetime-local input shows the value correctly
        let formattedDate = booking.scheduled_at;
        if (formattedDate.includes(" ")) {
            formattedDate = formattedDate.replace(" ", "T").substring(0, 16);
        }

        setEditingBooking({
            ...booking,
            scheduled_at: formattedDate,
        });
        setIsEditOpen(true);
    };

    // Handler: Save Changes
    const handleSave = async () => {
        if (!editingBooking) return;
        setIsSaving(true);

        const payload = {
            scheduled_at: editingBooking.scheduled_at,
            notes: editingBooking.notes,
        };

        const result = await editBooking(editingBooking.id, payload);

        setIsSaving(false);
        if (result.success) {
            setIsEditOpen(false);
        } else {
            alert(result.error || "Failed to update booking");
        }
    };

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading your history...</p>
            </div>
        );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold tracking-tight">
                Booking History
            </h2>

            {bookings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/50">
                    <p className="text-muted-foreground mb-4">
                        No bookings found. Time to schedule your first clean!
                    </p>
                    <Button
                        onClick={() =>
                            (window.location.href = "/dashboard?tab=book-new")
                        }
                    >
                        Book Now
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => {
                        // Check if booking is editable (Not completed/cancelled)
                        const isEditable = ![
                            "completed",
                            "cancelled",
                            "in_progress",
                        ].includes(booking.status);

                        return (
                            <Card
                                key={booking.id}
                                className="group hover:shadow-md transition-all duration-200"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Left: Info */}
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-lg">
                                                    {booking.service_type}
                                                </h3>
                                                <Badge
                                                    className={`${getStatusColor(
                                                        booking.status
                                                    )} text-white`}
                                                >
                                                    {booking.status.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    {format(
                                                        new Date(
                                                            booking.scheduled_at
                                                        ),
                                                        "PPP"
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    {format(
                                                        new Date(
                                                            booking.scheduled_at
                                                        ),
                                                        "p"
                                                    )}
                                                </span>
                                                {booking.address && (
                                                    <span className="flex items-center gap-2 sm:col-span-2 mt-1">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        {
                                                            booking.address
                                                                .street_address
                                                        }
                                                        , {booking.address.city}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Notes Preview (if any) */}
                                            {booking.notes && (
                                                <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded mt-2 border max-w-md">
                                                    "{booking.notes}"
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Actions & Price */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-2 min-w-[120px]">
                                            <span className="text-xl font-bold text-primary">
                                                ${booking.total_price}
                                            </span>

                                            {isEditable && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full md:w-auto"
                                                    onClick={() =>
                                                        handleEditClick(booking)
                                                    }
                                                >
                                                    <Pencil className="w-3 h-3 mr-2" />{" "}
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* --- EDIT MODAL --- */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                        <DialogDescription>
                            Make changes to your scheduled appointment.
                        </DialogDescription>
                    </DialogHeader>

                    {editingBooking && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date & Time</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={editingBooking.scheduled_at}
                                    onChange={(e) =>
                                        setEditingBooking({
                                            ...editingBooking,
                                            scheduled_at: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">
                                    Notes / Instructions
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={editingBooking.notes || ""}
                                    onChange={(e) =>
                                        setEditingBooking({
                                            ...editingBooking,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Any special requests?"
                                    className="resize-none h-24"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
