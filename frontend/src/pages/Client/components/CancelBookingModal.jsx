import React, { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCancelBooking } from "@/Hooks/useBookings";

export default function CancelBookingModal({
    booking,
    isOpen,
    onClose,
    onSuccess,
}) {
    const { mutateAsync: cancelBooking, isPending } = useCancelBooking();
    const [reason, setReason] = useState("");
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        if (!reason || reason.length < 5) {
            setError("Please provide a reason (minimum 5 characters).");
            return;
        }

        try {
            await cancelBooking({ id: booking.id, reason });
            onSuccess("Booking cancelled successfully.");
            onClose();
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to cancel booking."
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Cancel Booking
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this booking? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="text-foreground">
                            Reason for cancellation{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., I have to travel urgently..."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError(null);
                            }}
                            className="resize-none h-32"
                        />
                        {error && (
                            <p className="text-sm text-red-500 font-medium">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Keep Booking
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isPending || reason.length < 5}
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm Cancellation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
