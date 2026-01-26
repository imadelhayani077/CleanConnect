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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Clock, Phone, User as UserIcon } from "lucide-react";

// Import your updated helper
import { getAvatarUrl, getInitials } from "@/utils/avatarHelper";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString));
};

export default function MissionDetailModal({ booking, open, onClose }) {
    if (!booking) return null;

    const client = booking.user || {};

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 gap-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-sm flex flex-col">
                <DialogHeader className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                Mission Details
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-1">
                                Reference #{booking.id} — Review full details
                                below.
                            </DialogDescription>
                        </div>
                        <Badge
                            variant={
                                booking.status === "confirmed"
                                    ? "default"
                                    : "secondary"
                            }
                            className="capitalize"
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {booking.notes && (
                        <Alert className="bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                            <AlertDescription>
                                <span className="font-semibold">
                                    Client Note:
                                </span>{" "}
                                {booking.notes}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* --- CLIENT ACCORDION --- */}
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full border rounded-xl px-4 bg-card shadow-sm"
                    >
                        <AccordionItem
                            value="client-info"
                            className="border-b-0"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                        Client Information
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-0">
                                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                    {/* --- AVATAR FIX --- */}
                                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-sm">
                                        {/* Pass the WHOLE client object */}
                                        <AvatarImage
                                            src={getAvatarUrl(client)}
                                            alt={client.name}
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                            {/* getInitials expects a string name */}
                                            {getInitials(client.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-1">
                                        <p className="font-bold text-base text-foreground">
                                            {client.name || "Unknown Client"}
                                        </p>

                                        {client.phone ? (
                                            <a
                                                href={`tel:${client.phone}`}
                                                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Phone className="w-3 h-3 mr-1.5" />
                                                {client.phone}
                                            </a>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">
                                                Phone number hidden
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                            Services Requested
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {booking.services && booking.services.length > 0 ? (
                                booking.services.map((s, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                                    >
                                        {s.name}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    General Cleaning
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Location
                            </h4>
                            <div className="flex items-start gap-2 text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md">
                                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                                <div>
                                    <p className="font-medium">
                                        {booking.address?.street_address}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {booking.address?.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Schedule
                            </h4>
                            <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md h-full">
                                <Clock className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-medium">
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
