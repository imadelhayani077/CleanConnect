// src/pages/dashboards/StatCard.jsx
import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
    title,
    value,
    icon: Icon,
    colorClass,
    description,
}) {
    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <h3 className="text-3xl font-bold mt-2 text-foreground">
                            {value}
                        </h3>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                {description}
                            </p>
                        )}
                    </div>

                    <div
                        className={`p-3 rounded-lg bg-opacity-10 flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                        <Icon className="w-5 h-5 text-current" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
