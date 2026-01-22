// src/pages/dashboards/client/TrustFeatureCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function TrustFeatureCard({
    icon: Icon,
    title,
    description,
    color,
}) {
    const colorMap = {
        green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
        red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30">
            <CardContent className="pt-6">
                <div
                    className={`inline-flex p-3.5 rounded-xl mb-5 ${colorMap[color]}`}
                >
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
