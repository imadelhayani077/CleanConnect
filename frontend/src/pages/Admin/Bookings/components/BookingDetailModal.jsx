import React, { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertTriangle,
    MapPin,
    Clock,
    Layers3,
    Plus,
    Sparkles,
    Receipt,
    User2,
    ShieldCheck,
    Timer,
} from "lucide-react";

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

const safeArr = (v) => (Array.isArray(v) ? v : []);

const formatDuration = (mins) => {
    const m = Number(mins || 0);
    if (!m || m <= 0) return "N/A";
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (h <= 0) return `${r} min`;
    return `${h}h ${r < 10 ? "0" : ""}${r}m`;
};

export default function BookingDetailModal({ booking, open, onClose }) {
    if (!booking) return null;

    const statusKey = booking.status?.toLowerCase() || "pending";

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

    // ---- service + options + extras ----
    const bookingService = booking?.booking_services?.[0] || null;

    const serviceNames =
        safeArr(booking.services)
            .map((s) => s?.name)
            .filter(Boolean)
            .join(", ") ||
        bookingService?.service?.name ||
        "Cleaning Service";

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

    // ---- duration (supports multiple possible keys) ----
    const durationMinutes =
        booking?.duration_minutes ??
        booking?.estimated_duration_minutes ??
        bookingService?.duration_minutes ??
        bookingService?.total_duration_minutes ??
        bookingService?.estimated_duration_minutes ??
        bookingService?.service?.base_duration_minutes ??
        0;

    const durationLabel = formatDuration(durationMinutes);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[720px] max-h-[85vh] p-0 gap-0 overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-sm flex flex-col">
                <DialogHeader className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50">
                    <DialogTitle className="text-2xl font-black text-foreground">
                        Booking Details
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                        Reference #{booking.id}
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

                        {/* ✅ Duration badge */}
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
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {statusKey === "cancelled" && (
                        <Alert className="border-red-200 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20 animate-in slide-in-from-top rounded-2xl">
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                <span className="font-semibold">
                                    Booking Cancelled
                                </span>
                                {" — "}
                                {booking.cancellation_reason ||
                                    "No reason provided"}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* People */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 dark:from-slate-900/60 to-slate-100/40 dark:to-slate-900/20 p-4 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Client
                                </p>
                                <Badge variant="secondary" className="border-0">
                                    <span className="inline-flex items-center gap-1.5">
                                        <User2 className="w-3.5 h-3.5" />
                                        Customer
                                    </span>
                                </Badge>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                                    {booking.user?.name?.charAt(0) || "?"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground text-sm truncate">
                                        {booking.user?.name || "N/A"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {booking.user?.email || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 dark:from-slate-900/60 to-slate-100/40 dark:to-slate-900/20 p-4 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Assigned Sweepstar
                                </p>
                                <Badge variant="secondary" className="border-0">
                                    <span className="inline-flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Provider
                                    </span>
                                </Badge>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-blue-100/60 dark:bg-blue-900/20 flex items-center justify-center text-blue-700 dark:text-blue-400 font-black text-sm">
                                    {booking.sweepstar?.name?.charAt(0) || "?"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground text-sm truncate">
                                        {booking.sweepstar?.name ||
                                            "Not Assigned"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {booking.sweepstar?.email ||
                                            "Waiting for assignment"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200 dark:bg-slate-800" />

                    {/* Service */}
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

                        {/* Options/Extras */}
                        {(selectedOptions.length > 0 ||
                            selectedExtras.length > 0) && (
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
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
                                            {selectedOptions
                                                .slice(0, 6)
                                                .map((name) => (
                                                    <span
                                                        key={name}
                                                        className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-foreground/80 shadow-sm"
                                                    >
                                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                                        <span className="max-w-[220px] truncate">
                                                            {name}
                                                        </span>
                                                    </span>
                                                ))}
                                            {selectedOptions.length > 6 && (
                                                <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                                                    +
                                                    {selectedOptions.length - 6}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No options selected
                                        </p>
                                    )}
                                </div>

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
                                            {selectedExtras
                                                .slice(0, 6)
                                                .map((name) => (
                                                    <span
                                                        key={name}
                                                        className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-foreground/80 shadow-sm"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 text-primary" />
                                                        <span className="max-w-[220px] truncate">
                                                            {name}
                                                        </span>
                                                    </span>
                                                ))}
                                            {selectedExtras.length > 6 && (
                                                <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                                                    +{selectedExtras.length - 6}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No extra tasks selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator className="bg-slate-200 dark:bg-slate-800" />

                    {/* Location & Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-br from-slate-50 dark:from-slate-900/60 to-slate-100/40 dark:to-slate-900/20">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Location
                            </p>
                            <p className="mt-2 text-sm text-foreground flex items-start gap-2 font-medium">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span>
                                    {booking.address?.street_address || "N/A"}
                                    {booking.address?.city
                                        ? `, ${booking.address.city}`
                                        : ""}
                                </span>
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-br from-slate-50 dark:from-slate-900/60 to-slate-100/40 dark:to-slate-900/20">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Scheduled Date & Time
                            </p>
                            <p className="mt-2 text-sm text-foreground flex items-center gap-2 font-medium">
                                <Clock className="w-4 h-4 text-primary" />
                                {formatDate(booking.scheduled_at)}
                            </p>
                        </div>
                    </div>

                    {booking.notes && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-muted/10">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Notes
                            </p>
                            <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">
                                {booking.notes}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
