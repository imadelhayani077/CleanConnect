// src/components/booking/BookingFilter.jsx
import React from "react";
import { Filter } from "lucide-react";

export default function BookingFilter({ filterStatus, onFilterChange, stats }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                    Filter by Status:
                </span>
            </div>
            <select
                className="px-4 py-2 rounded-lg border border-border/60 bg-muted/40 text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                value={filterStatus}
                onChange={(e) => onFilterChange(e.target.value)}
            >
                <option value="all">All Statuses ({stats.total})</option>
                <option value="pending">Pending ({stats.pending})</option>
                <option value="confirmed">Confirmed ({stats.confirmed})</option>
                <option value="completed">Completed ({stats.completed})</option>
                <option value="cancelled">Cancelled ({stats.cancelled})</option>
            </select>
        </div>
    );
}
