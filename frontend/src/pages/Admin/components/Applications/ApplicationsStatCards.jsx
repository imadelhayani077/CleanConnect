// src/components/applications/ApplicationStats.jsx
import React from "react";
import { FileText, DollarSign, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplicationsStatCards({
    applicationsCount,
    filteredCount,
    avgRate,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Pending Applications
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                {applicationsCount}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Avg. Requested Rate
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                ${avgRate}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/20">
                            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Filtered Results
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                {filteredCount}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-100/60 dark:bg-blue-900/20">
                            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
