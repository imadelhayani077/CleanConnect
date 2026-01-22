// src/pages/admin/ServiceStats.jsx
import React from "react";
import { Briefcase, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceStats({ services }) {
    const total = services.length;
    const avgPrice =
        total > 0
            ? (
                  services.reduce(
                      (sum, s) => sum + Number(s.base_price || 0),
                      0,
                  ) / total
              ).toFixed(2)
            : "0.00";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Services
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                {total}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10">
                            <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Average Price
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                ${avgPrice}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/20">
                            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
