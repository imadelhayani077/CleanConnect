// src/components/booking/BookingStats.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    CalendarDays,
    Clock,
    CheckCircle,
    TrendingUp,
    XCircle,
} from "lucide-react";

export default function BookingStats({ bookings }) {
    const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };

    const statItems = [
        {
            label: "Total",
            value: stats.total,
            icon: CalendarDays,
            color: "from-primary/20 to-primary/10 text-primary",
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "from-amber-100/60 to-amber-50/60 dark:from-amber-900/20 dark:to-amber-900/10 text-amber-600 dark:text-amber-400",
        },
        {
            label: "Confirmed",
            value: stats.confirmed,
            icon: CheckCircle,
            color: "from-blue-100/60 to-blue-50/60 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-600 dark:text-blue-400",
        },
        {
            label: "Completed",
            value: stats.completed,
            icon: TrendingUp,
            color: "from-emerald-100/60 to-emerald-50/60 dark:from-emerald-900/20 dark:to-emerald-900/10 text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            color: "from-red-100/60 to-red-50/60 dark:from-red-900/20 dark:to-red-900/10 text-red-600 dark:text-red-400",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statItems.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={idx}
                        className={`rounded-xl border-border/60 bg-gradient-to-br ${stat.color} backdrop-blur-sm`}
                    >
                        <CardContent className="p-4 text-center">
                            <Icon className="w-5 h-5 mx-auto mb-2 opacity-60" />
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                                {stat.value}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
