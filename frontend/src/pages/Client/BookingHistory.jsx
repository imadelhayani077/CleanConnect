import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    MapPin,
    Clock,
    Pencil,
    Loader2,
    AlertCircle,
    CheckCircle2,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- HOOKS (Single Source of Truth) ---
import { useMyBookings, useEditBooking } from "@/Hooks/useBookings";

// --- Helper Constants ---
const STATUS_STYLES = {
    completed: "bg-green-500 hover:bg-green-600 border-transparent",
    confirmed: "bg-blue-500 hover:bg-blue-600 border-transparent",
    cancelled: "bg-red-500 hover:bg-red-600 border-transparent",
    pending: "bg-yellow-500 hover:bg-yellow-600 border-transparent",
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

// --- Sub-Component: Individual Booking Card ---
const BookingCard = ({ booking, onEdit }) => {
    const isEditable = !["completed", "cancelled", "in_progress"].includes(
        booking.status
    );
    const badgeColor = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

    return (
        <Card className="group hover:shadow-md transition-all duration-200 border-muted/60">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-foreground">
                                {booking.service?.name || "Cleaning Service"}
                            </h3>
                            <Badge
                                className={`${badgeColor} text-white uppercase shadow-sm`}
                            >
                                {booking.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {format(new Date(booking.scheduled_at), "PPP")}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {format(new Date(booking.scheduled_at), "p")}
                            </span>
                            {booking.address && (
                                <span className="flex items-center gap-2 sm:col-span-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {booking.address.street_address},{" "}
                                    {booking.address.city}
                                </span>
                            )}
                        </div>

                        {/* Notes Preview */}
                        {booking.notes && (
                            <div className="text-xs text-muted-foreground italic bg-muted/50 p-2.5 rounded-md mt-2 border border-muted max-w-md">
                                "{booking.notes}"
                            </div>
                        )}
                    </div>

                    {/* Right: Actions & Price */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-2 min-w-[120px]">
                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(booking.total_price)}
                        </span>

                        {isEditable && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto border-primary/20 hover:bg-primary/5 text-primary"
                                onClick={() => onEdit(booking)}
                            >
                                <Pencil className="w-3.5 h-3.5 mr-2" />
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Main Component ---
export default function BookingHistory() {
    const navigate = useNavigate();

    // 1. Fetch Data using Query Hook
    const { data: bookings = [], isLoading } = useMyBookings();

    // 2. Setup Mutation Hook
    const { mutateAsync: updateBooking, isPending: isSaving } =
        useEditBooking();

    // Local State for Modal and feedback
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    // Handler: Open Edit Modal
    const handleEditClick = (booking) => {
        const dateObj = new Date(booking.scheduled_at);
        const formattedForInput = format(dateObj, "yyyy-MM-dd'T'HH:mm");

        setEditingBooking({
            ...booking,
            scheduled_at: formattedForInput,
        });
        setIsEditOpen(true);
        setUpdateError(null);
        setUpdateSuccess(null);
    };

    // Handler: Save Changes
    const handleSave = async () => {
        if (!editingBooking) return;

        setUpdateError(null);
        setUpdateSuccess(null);

        try {
            const payload = {
                scheduled_at: new Date(
                    editingBooking.scheduled_at
                ).toISOString(),
                notes: editingBooking.notes,
            };

            await updateBooking({
                id: editingBooking.id,
                data: payload,
            });

            setUpdateSuccess("Your booking details have been updated.");
            setIsEditOpen(false);
            // list will refetch via query invalidation
        } catch (error) {
            console.error("Save failed", error);
            setUpdateError(
                error?.response?.data?.message || "Could not update booking."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p>Loading your history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    Booking History
                </h2>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </Button>
            </div>

            {updateError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Update Failed</AlertTitle>
                    <AlertDescription>{updateError}</AlertDescription>
                </Alert>
            )}

            {updateSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Update Successful</AlertTitle>
                    <AlertDescription>{updateSuccess}</AlertDescription>
                </Alert>
            )}

            {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/30">
                    <p className="text-lg text-muted-foreground mb-4">
                        You haven't made any bookings yet.
                    </p>
                    <Button onClick={() => navigate("/book-service")}>
                        Book Your First Clean
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onEdit={handleEditClick}
                        />
                    ))}
                </div>
            )}

            {/* --- EDIT MODAL --- */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                        <DialogDescription>
                            Change the date or add notes for your cleaner.
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
                                        setEditingBooking((prev) => ({
                                            ...prev,
                                            scheduled_at: e.target.value,
                                        }))
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
                                        setEditingBooking((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    placeholder="Gate code, key location, etc..."
                                    className="resize-none h-32"
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
