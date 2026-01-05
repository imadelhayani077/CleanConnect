import React from "react";
import { format } from "date-fns";
import {
    Loader2,
    User,
    Mail,
    Phone,
    Calendar,
    Star,
    Briefcase,
    ShieldCheck,
    DollarSign,
    MapPin,
    MessageSquare,
    X,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

// Hook
import { useUserDetails } from "@/Hooks/useUsers";

export default function UserDetailModal({ userId, isOpen, onClose }) {
    const { data: user, isLoading } = useUserDetails(userId);

    // Calculate Average Rating for Sweepstar
    const getAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return "N/A";
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* FIXED: Removed fixed height issues, used max-h and overflow-y-auto */}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {/* Header - Fixed at top */}
                <DialogHeader className="p-6 pb-4 border-b bg-background z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl flex items-center gap-3">
                            User Details
                            {user && (
                                <Badge
                                    variant={
                                        user.role === "sweepstar"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="uppercase"
                                >
                                    {user.role}
                                </Badge>
                            )}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading || !user ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* 1. Basic Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="space-y-1">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <User className="w-4 h-4" /> Full Name
                                    </span>
                                    <p className="font-medium text-base pl-6">
                                        {user.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" /> Email
                                        Address
                                    </span>
                                    <p className="font-medium text-base pl-6">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" /> Phone
                                        Number
                                    </span>
                                    <p className="font-medium text-base pl-6">
                                        {user.phone || "Not provided"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" /> Date
                                        Joined
                                    </span>
                                    <p className="font-medium text-base pl-6">
                                        {format(
                                            new Date(user.created_at),
                                            "PPP"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* 2. SWEEPSTAR SPECIFIC DATA */}
                            {user.role === "sweepstar" && (
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                        Sweepstar Profile
                                    </h3>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <Card className="bg-muted/30 border-0">
                                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                <div className="p-2 bg-green-100 rounded-full mb-2">
                                                    <DollarSign className="w-5 h-5 text-green-700" />
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                                    Rate
                                                </span>
                                                <span className="font-bold text-lg">
                                                    $
                                                    {user.sweepstar_profile
                                                        ?.hourly_rate || 0}
                                                    /hr
                                                </span>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-muted/30 border-0">
                                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                <div className="p-2 bg-blue-100 rounded-full mb-2">
                                                    <Briefcase className="w-5 h-5 text-blue-700" />
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                                    Jobs Done
                                                </span>
                                                <span className="font-bold text-lg">
                                                    {user.sweepstar_bookings
                                                        ?.length || 0}
                                                </span>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-muted/30 border-0">
                                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                <div className="p-2 bg-yellow-100 rounded-full mb-2">
                                                    <Star className="w-5 h-5 text-yellow-700" />
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                                    Rating
                                                </span>
                                                <span className="font-bold text-lg">
                                                    {getAverageRating(
                                                        user.reviews_received
                                                    )}{" "}
                                                    ★
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Reviews Received List */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                            Reviews from Clients
                                        </h4>
                                        {user.reviews_received &&
                                        user.reviews_received.length > 0 ? (
                                            <div className="grid gap-3">
                                                {user.reviews_received.map(
                                                    (review) => (
                                                        <div
                                                            key={review.id}
                                                            className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm">
                                                                        {review
                                                                            .reviewer
                                                                            ?.name ||
                                                                            "Anonymous Client"}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        •{" "}
                                                                        {format(
                                                                            new Date(
                                                                                review.created_at
                                                                            ),
                                                                            "MMM d, yyyy"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex text-yellow-400 text-xs">
                                                                    {"★".repeat(
                                                                        review.rating
                                                                    )}
                                                                    <span className="text-muted text-xs">
                                                                        {"★".repeat(
                                                                            5 -
                                                                                review.rating
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground italic">
                                                                "
                                                                {review.comment ||
                                                                    "No comment provided."}
                                                                "
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                                No reviews received yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 3. CLIENT SPECIFIC DATA */}
                            {user.role === "client" && (
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        Client Activity
                                    </h3>

                                    {/* Booking History */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                            Recent Bookings
                                        </h4>
                                        {user.client_bookings &&
                                        user.client_bookings.length > 0 ? (
                                            <div className="border rounded-md divide-y">
                                                {user.client_bookings.map(
                                                    (booking) => (
                                                        <div
                                                            key={booking.id}
                                                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                        >
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-sm">
                                                                        {booking.services
                                                                            ?.map(
                                                                                (
                                                                                    s
                                                                                ) =>
                                                                                    s.name
                                                                            )
                                                                            .join(
                                                                                ", "
                                                                            ) ||
                                                                            "Cleaning"}
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-[10px] h-5"
                                                                    >
                                                                        {
                                                                            booking.status
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {format(
                                                                        new Date(
                                                                            booking.scheduled_at
                                                                        ),
                                                                        "PPP p"
                                                                    )}
                                                                </div>
                                                                {booking.sweepstar && (
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                        <User className="w-3 h-3" />
                                                                        Sweepstar:{" "}
                                                                        <span className="font-medium">
                                                                            {
                                                                                booking
                                                                                    .sweepstar
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-right sm:text-lg">
                                                                $
                                                                {
                                                                    booking.total_price
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                                No bookings made yet.
                                            </div>
                                        )}
                                    </div>

                                    {/* Reviews Written */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                            Reviews Written
                                        </h4>
                                        {user.reviews_written &&
                                        user.reviews_written.length > 0 ? (
                                            <div className="grid gap-3">
                                                {user.reviews_written.map(
                                                    (review) => (
                                                        <div
                                                            key={review.id}
                                                            className="p-4 rounded-lg border bg-muted/20"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="text-sm">
                                                                    <span className="text-muted-foreground">
                                                                        Reviewed{" "}
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {review
                                                                            .target
                                                                            ?.name ||
                                                                            "a Sweepstar"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex text-yellow-500 text-xs">
                                                                    {"★".repeat(
                                                                        review.rating
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground italic">
                                                                "
                                                                {review.comment}
                                                                "
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                                This client hasn't written any
                                                reviews.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
