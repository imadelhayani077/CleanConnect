import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Clock,
    Phone,
    User as UserIcon,
    Sparkles,
    DollarSign,
    ShieldCheck,
} from "lucide-react";

// --- IMPORT HELPER ---
import { getAvatarUrl, getInitials } from "@/utils/avatarHelper";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);

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

    const sweepstar = booking.sweepstar;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 gap-0 overflow-hidden rounded-2xl border-border/60 bg-background/95 backdrop-blur-sm flex flex-col">
                {/* Header */}
                <DialogHeader className="flex-shrink-0 p-6 border-b border-border/40 bg-muted/20">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                Booking Details
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-1">
                                Reference #{booking.id}
                            </DialogDescription>
                        </div>
                        <Badge
                            variant="outline"
                            className="capitalize text-sm px-3 py-1"
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* --- SWEEPSTAR ACCORDION --- */}
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full border rounded-xl px-4 bg-card shadow-sm"
                    >
                        <AccordionItem
                            value="sweepstar-info"
                            className="border-b-0"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                        Assigned Professional
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-0">
                                {sweepstar ? (
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                        {/* Avatar with Helper */}
                                        <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-sm">
                                            <AvatarImage
                                                src={getAvatarUrl(sweepstar)}
                                                alt={sweepstar.name}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                                {getInitials(sweepstar.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="space-y-1">
                                            <p className="font-bold text-base text-foreground flex items-center gap-2">
                                                {sweepstar.name}
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] h-5 px-1.5 gap-1"
                                                >
                                                    <ShieldCheck className="w-3 h-3" />{" "}
                                                    Verified
                                                </Badge>
                                            </p>

                                            {booking.status === "confirmed" ||
                                            booking.status === "in_progress" ? (
                                                <a
                                                    href={`tel:${sweepstar.phone}`}
                                                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <Phone className="w-3 h-3 mr-1.5" />
                                                    {sweepstar.phone}
                                                </a>
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">
                                                    Contact info hidden until
                                                    active
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-muted/20 rounded-lg text-center border border-dashed">
                                        <p className="text-sm text-muted-foreground">
                                            We are currently looking for a
                                            Sweepstar for you.
                                        </p>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Separator />

                    {/* Services */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                            Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {booking.services &&
                                booking.services.map((s, i) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="px-3 py-1"
                                    >
                                        {s.name}
                                    </Badge>
                                ))}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-3 rounded-lg bg-muted/30 border">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" /> Location
                            </h4>
                            <div className="text-sm">
                                <p className="font-medium">
                                    {booking.address?.street_address}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {booking.address?.city}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 p-3 rounded-lg bg-muted/30 border">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> Schedule
                            </h4>
                            <div className="text-sm">
                                <p className="font-medium">
                                    {formatDate(booking.scheduled_at)}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {booking.scheduled_at
                                        ? new Date(
                                              booking.scheduled_at,
                                          ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Time N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-semibold text-sm">
                                Total Amount
                            </span>
                        </div>
                        <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(booking.total_price)}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
