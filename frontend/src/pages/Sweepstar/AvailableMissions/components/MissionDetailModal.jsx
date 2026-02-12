import React, { useMemo } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    MapPin,
    Clock,
    Phone,
    User as UserIcon,
    Layers3,
    Plus,
    Sparkles,
    Receipt,
    Timer,
    ShieldCheck,
} from "lucide-react";

import { getAvatarUrl, getInitials } from "@/utils/avatarHelper";

const safeArr = (v) => (Array.isArray(v) ? v : []);

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString));
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount || 0));

const formatDuration = (mins) => {
    const m = Number(mins || 0);
    if (!m || m <= 0) return "N/A";
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (h <= 0) return `${r} min`;
    return `${h}h ${r < 10 ? "0" : ""}${r}m`;
};

// Small chip component for consistent style
function Chip({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-foreground/80 shadow-sm">
            {Icon ? <Icon className="w-3.5 h-3.5 text-primary" /> : null}
            <span className="max-w-[240px] truncate">{children}</span>
        </span>
    );
}

export default function MissionDetailModal({ booking, open, onClose }) {
    if (!booking) return null;
    console.log(booking);

    const statusKey = booking.status?.toLowerCase() || "pending";
    const client = booking.user || {};

    const STATUS_STYLES = {
        completed:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        confirmed:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        cancelled:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        pending:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        in_progress:
            "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    };

    // bookingService + service title
    const bookingService = booking?.booking_services?.[0] || null;

    const serviceNames =
        safeArr(booking.services)
            .map((s) => s?.name)
            .filter(Boolean)
            .join(", ") ||
        bookingService?.service?.name ||
        "Cleaning Service";

    // ✅ options + extras (supports multiple possible API shapes)
    const selectedOptions = useMemo(() => {
        const raw =
            bookingService?.selected_options ||
            bookingService?.options ||
            bookingService?.booking_service_options ||
            [];
        return safeArr(raw)
            .map((o) => o?.service_option?.name || o?.option?.name || o?.name)
            .filter(Boolean);
    }, [bookingService]);

    const selectedExtras = useMemo(() => {
        const raw =
            bookingService?.selected_extras ||
            bookingService?.extras ||
            bookingService?.booking_service_extras ||
            [];

        return safeArr(raw)
            .map((e) => e?.service_extra?.name || e?.extra?.name || e?.name)
            .filter(Boolean);
    }, [bookingService]);

    // duration
    const durationMinutes =
        booking?.duration_minutes ??
        booking?.estimated_duration_minutes ??
        bookingService?.duration_minutes ??
        bookingService?.total_duration_minutes ??
        bookingService?.estimated_duration_minutes ??
        bookingService?.service?.base_duration_minutes ??
        0;

    const durationLabel = formatDuration(durationMinutes);

    // show a few chips + count
    const topOptions = selectedOptions.slice(0, 8);
    const moreOptions = Math.max(0, selectedOptions.length - topOptions.length);

    const topExtras = selectedExtras.slice(0, 8);
    const moreExtras = Math.max(0, selectedExtras.length - topExtras.length);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[720px] max-h-[85vh] p-0 gap-0 overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-sm flex flex-col">
                <DialogHeader className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50">
                    <DialogTitle className="text-2xl font-black text-foreground">
                        Mission Details
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                        Reference #{booking.id} — Review full details below.
                    </DialogDescription>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Badge
                            className={`border-0 shadow-sm capitalize ${
                                STATUS_STYLES[statusKey] ||
                                STATUS_STYLES.pending
                            }`}
                        >
                            {booking.status}
                        </Badge>

                        {booking.total_price != null && (
                            <Badge
                                variant="secondary"
                                className="border-0 shadow-sm"
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <Receipt className="w-3.5 h-3.5" />
                                    {formatCurrency(booking.total_price)}
                                </span>
                            </Badge>
                        )}

                        {durationLabel !== "N/A" && (
                            <Badge
                                variant="secondary"
                                className="border-0 shadow-sm"
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <Timer className="w-3.5 h-3.5" />
                                    {durationLabel}
                                </span>
                            </Badge>
                        )}

                        {booking.sweepstar && (
                            <Badge
                                variant="secondary"
                                className="border-0 shadow-sm"
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Assigned
                                </span>
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {booking.notes && (
                        <Alert className="rounded-2xl bg-blue-50/50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                            <AlertDescription className="text-sm">
                                <span className="font-semibold">
                                    Client Note:
                                </span>{" "}
                                {booking.notes}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Client Accordion */}
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-muted/10 overflow-hidden"
                    >
                        <AccordionItem
                            value="client-info"
                            className="border-b-0"
                        >
                            <AccordionTrigger className="hover:no-underline px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">
                                            Client Information
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Tap to view contact details
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-4 pb-4 pt-0">
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-background/60 p-4 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-sm">
                                            <AvatarImage
                                                src={getAvatarUrl(client)}
                                                alt={client.name}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-black">
                                                {getInitials(client.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-base text-foreground truncate">
                                                {client.name ||
                                                    "Unknown Client"}
                                            </p>

                                            {client.phone ? (
                                                <a
                                                    href={`tel:${client.phone}`}
                                                    className="mt-1 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                                                    {client.phone}
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-xs text-muted-foreground italic">
                                                    Phone number hidden
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Separator className="bg-slate-200 dark:bg-slate-800" />

                    {/* Service + Options + Extras */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-muted/10">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Service
                                </p>
                                <p className="mt-2 text-lg font-bold text-foreground">
                                    {serviceNames}
                                </p>
                            </div>

                            <Badge className="bg-purple-100/60 text-purple-700 border-purple-200/60 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/60 font-semibold">
                                Requested
                            </Badge>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {/* ✅ Options */}
                            <div className="rounded-2xl border bg-background/60 p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <Layers3 className="w-4 h-4 text-primary" />
                                        Options
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="border-0"
                                    >
                                        {selectedOptions.length}
                                    </Badge>
                                </div>

                                {selectedOptions.length > 0 ? (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {topOptions.map((name) => (
                                            <Chip key={name} icon={Sparkles}>
                                                {name}
                                            </Chip>
                                        ))}
                                        {moreOptions > 0 && (
                                            <Chip>+{moreOptions} more</Chip>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No options selected
                                    </p>
                                )}
                            </div>

                            {/* ✅ Extras */}
                            <div className="rounded-2xl border bg-background/60 p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <Plus className="w-4 h-4 text-primary" />
                                        Extra Tasks
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="border-0"
                                    >
                                        {selectedExtras.length}
                                    </Badge>
                                </div>

                                {selectedExtras.length > 0 ? (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {topExtras.map((name) => (
                                            <Chip key={name} icon={Plus}>
                                                {name}
                                            </Chip>
                                        ))}
                                        {moreExtras > 0 && (
                                            <Chip>+{moreExtras} more</Chip>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No extra tasks selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200 dark:bg-slate-800" />

                    {/* Location + Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-br from-slate-50 dark:from-slate-900/60 to-slate-100/40 dark:to-slate-900/20">
                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Location
                            </p>
                            <div className="mt-2 flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-sm text-foreground">
                                        {booking.address?.street_address ||
                                            "N/A"}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {booking.address?.city || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-br from-slate-50 dark:from-slate-900/60 to-slate-100/40 dark:to-slate-900/20">
                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Schedule
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-medium text-sm text-foreground">
                                    {formatDate(booking.scheduled_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
