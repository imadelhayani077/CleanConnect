// src/pages/dashboards/client/DashboardStatCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
    onClick,
    highlight = false,
}) {
    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg group border ${
                highlight
                    ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/70"
                    : "hover:border-primary/40"
            }`}
        >
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-primary transition-colors">
                            {title}
                        </p>
                        <p className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                            {value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div
                        className={`p-4 rounded-2xl transition-all duration-300 ${
                            highlight
                                ? "bg-primary/20 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:scale-110"
                                : "bg-muted/50 group-hover:bg-primary/10"
                        }`}
                    >
                        <Icon
                            className={`w-7 h-7 transition-all ${
                                highlight
                                    ? "text-primary group-hover:text-white"
                                    : "text-muted-foreground group-hover:text-primary"
                            }`}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
