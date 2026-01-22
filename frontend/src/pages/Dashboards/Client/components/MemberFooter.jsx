// src/pages/dashboards/client/MemberFooter.jsx
import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function MemberFooter({ user, totalBookings }) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-green-100/60 dark:bg-green-900/30">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(user?.created_at).toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                year: "numeric",
                            },
                        )}
                    </p>
                </div>
            </div>

            <div className="text-center sm:text-right">
                <p className="text-lg font-semibold">{totalBookings}</p>
                <p className="text-xs text-muted-foreground">
                    Bookings completed
                </p>
            </div>
        </div>
    );
}
