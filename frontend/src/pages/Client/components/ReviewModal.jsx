// Modern Review Modal - Key Improvements:

import React, { useState, useEffect } from "react";
import { Loader2, Trash2, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
    const [deleteError, setDeleteError] = useState(null);

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
            onSuccess("Review saved successfully!");
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete this review permanently?")) {
            try {
                await deleteReview.mutateAsync(reviewId);
                onSuccess("Review deleted!");
                onClose();
            } catch (e) {
                setDeleteError("Failed to delete review");
            }
        }
    };

    const isPending = submitReview.isPending || updateReview.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl border-border/60 bg-background/80 backdrop-blur-xl">
                <DialogHeader className="border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100/60 dark:bg-amber-900/20">
                            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl">
                                {reviewId
                                    ? "Edit Your Review"
                                    : "Rate This Service"}
                            </DialogTitle>
                            <DialogDescription>
                                {reviewId
                                    ? "Update your rating and feedback for this service."
                                    : "Please rate your experience with the service provider."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* Star Rating */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">
                            Your Rating
                        </p>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-all transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-all ${
                                            star <= rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-muted-foreground/30 hover:text-amber-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-center">
                            <Badge className="bg-amber-100/60 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60 text-sm">
                                {rating} out of 5 stars
                            </Badge>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Your Experience
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this service..."
                            className="resize-none rounded-lg bg-muted/40 border-border/60 min-h-24"
                        />
                    </div>

                    {/* Delete Error */}
                    {deleteError && (
                        <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                {deleteError}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="border-t border-border/60 pt-4 flex justify-between">
                    {reviewId && (
                        <Button
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20 gap-2"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    )}
                    <div className="flex gap-2 ml-auto">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-lg border-border/60"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg transition-all gap-2 font-semibold text-white"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Star className="h-4 w-4 fill-current" />
                                    {reviewId
                                        ? "Update Review"
                                        : "Submit Review"}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
