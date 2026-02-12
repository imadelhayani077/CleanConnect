// src/pages/booking/Components/BookingHistoryFilters.jsx
import React from "react";
import { FilterX } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export default function BookingHistoryFilters({
    statusFilter,
    setStatusFilter,
    totalCount,
    filteredCount,
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px] rounded-lg bg-background border-border/60">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setStatusFilter("all")}
                >
                    <FilterX className="h-4 w-4" />
                    Clear Filter
                </Button>
            </div>

            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredCount}</span> of{" "}
                <span className="font-medium">{totalCount}</span> bookings
            </p>
        </div>
    );
}
