import React, { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    useSubmitReview,
    useUpdateReview,
    useDeleteReview,
} from "@/Hooks/useReviews";

export default function ReviewModal({ booking, isOpen, onClose, onSuccess }) {
    const submitReview = useSubmitReview();
    const updateReview = useUpdateReview();
    const deleteReview = useDeleteReview();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    // Check if editing or creating
    const reviewId = booking?.review?.id;

    useEffect(() => {
        if (booking?.review) {
            setRating(booking.review.rating);
            setComment(booking.review.comment || "");
        } else {
            setRating(5);
            setComment("");
        }
    }, [booking]);

    const handleSave = async () => {
        try {
            if (reviewId) {
                await updateReview.mutateAsync({
                    id: reviewId,
                    data: { rating, comment },
                });
            } else {
                await submitReview.mutateAsync({
                    booking_id: booking.id,
                    rating,
                    comment,
                });
            }
            onSuccess("Review saved!");
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    const isPending = submitReview.isPending || updateReview.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {reviewId ? "Edit Review" : "Rate Service"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 justify-center py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-3xl ${
                                star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Experience..."
                />

                <DialogFooter>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
