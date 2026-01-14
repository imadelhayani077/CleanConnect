import React from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function BookingFilter({ filterStatus, onFilterChange, stats }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                    Filter by Status:
                </span>
            </div>
            <div className="relative">
                <select
                    className="pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/40 cursor-pointer appearance-none text-foreground"
                    value={filterStatus}
                    onChange={(e) => onFilterChange(e.target.value)}
                >
                    <option value="all">All Statuses ({stats.total})</option>
                    <option value="pending">
                        ⏳ Pending ({stats.pending})
                    </option>
                    <option value="confirmed">
                        ✓ Confirmed ({stats.confirmed})
                    </option>
                    <option value="completed">
                        ✓ Completed ({stats.completed})
                    </option>
                    <option value="cancelled">
                        ✗ Cancelled ({stats.cancelled})
                    </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
        </div>
    );
}
