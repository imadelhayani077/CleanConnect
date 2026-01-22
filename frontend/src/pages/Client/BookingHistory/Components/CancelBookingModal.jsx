import React, { useState } from "react";
import { Loader2, AlertTriangle, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
                <DialogHeader className="border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100/60 dark:bg-red-900/20">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl text-red-600 dark:text-red-400">
                                Cancel Booking
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Are you sure? This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
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
                            className="resize-none h-32 rounded-lg bg-muted/40 border-border/60"
                        />
                        {error && (
                            <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                    {error}
                                </AlertDescription>
                            </Alert>
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
