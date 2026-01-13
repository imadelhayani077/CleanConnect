// src/components/jobs/EmptyJobsState.jsx
import { Briefcase, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyJobsState() {
    return (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 dark:from-slate-900/30 to-slate-100/30 dark:to-slate-900/10 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                    <Briefcase className="w-10 h-10 text-muted-foreground" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">
                    No Jobs Available Right Now
                </h3>

                <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                    Don't worry! New job opportunities are posted constantly.
                    Check back in a few minutes or stay online to receive
                    instant notifications.
                </p>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 w-full max-w-sm">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 text-left">
                        Stay online for instant notifications!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
