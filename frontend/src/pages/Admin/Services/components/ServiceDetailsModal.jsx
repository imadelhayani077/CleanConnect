import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, LayoutGrid, ListChecks, Info } from "lucide-react";

// ... keep imports the same

export default function ServiceDetailsModal({ isOpen, onClose, service }) {
    if (!service) return null;

    const groupedOptions = service.options?.reduce((acc, option) => {
        const group = option.option_group_name || "General";
        if (!acc[group]) acc[group] = [];
        acc[group].push(option);
        return acc;
    }, {});

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* CHANGE: Added h-[85vh] and removed overflow-hidden to let Dialog handle it */}
            {/* <DialogContent className="max-w-xl h-[85vh] flex flex-col p-0"> */}
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 h-[90vh]">
                <DialogHeader className="p-6 text-center flex flex-col items-center shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        {service.service_icon ? (
                            <img
                                src={`http://localhost:8000${service.service_icon}`}
                                alt={service.name}
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <LayoutGrid className="w-10 h-10 text-primary" />
                        )}
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {service.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-2 max-w-sm">
                        {service.description ||
                            "Detailed overview of service configuration."}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="shrink-0" />

                {/* CHANGE: Added flex-grow and used a wrapper if needed,
                    but flex-1 on ScrollArea inside a flex-col DialogContent usually does the trick */}
                {/* <ScrollArea className="flex-1 w-full rounded-md border-t bg-muted/5"> */}
                <ScrollArea className="flex-1 p-6 h-[1px]">  {/* h-[1px] forces viewport height */}

                    <div className="p-6 space-y-8">
                        {/* 1. Service Options */}
                        <section>
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <Info className="w-4 h-4" />
                                <h4 className="font-semibold text-sm uppercase tracking-wider">
                                    Service Options
                                </h4>
                            </div>

                            {groupedOptions &&
                            Object.keys(groupedOptions).length > 0 ? (
                                <div className="space-y-6">
                                    {Object.entries(groupedOptions).map(
                                        ([groupName, options]) => (
                                            <div key={groupName}>
                                                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase ml-1">
                                                    {groupName}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {options.map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            className="px-4 py-2 rounded-lg border bg-background text-sm font-medium shadow-sm flex items-center gap-2"
                                                        >
                                                            {opt.name}
                                                            <span className="text-primary font-bold border-l pl-2">
                                                                $
                                                                {
                                                                    opt.option_price
                                                                }
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    No options configured.
                                </p>
                            )}
                        </section>

                        {/* 2. Service Tasks */}
                        <section className="pb-6">
                            {" "}
                            {/* Added padding bottom for breathing room */}
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <ListChecks className="w-4 h-4" />
                                <h4 className="font-semibold text-sm uppercase tracking-wider">
                                    Included Tasks / Extras
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {service.extras && service.extras.length > 0 ? (
                                    service.extras.map((extra) => (
                                        <div
                                            key={extra.id}
                                            className="flex items-center justify-between p-3 rounded-xl border border-dashed bg-card"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-medium">
                                                    {extra.name}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="font-bold"
                                            >
                                                ${extra.extra_price}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No extra tasks assigned.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
