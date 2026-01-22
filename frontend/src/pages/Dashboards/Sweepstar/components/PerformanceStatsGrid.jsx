import { Briefcase, Star, DollarSign, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function PremiumStatCard({
    icon: Icon,
    label,
    value,
    subtext,
    color,
    trend,
    onClick,
}) {
    const colorClasses = {
        primary:
            "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/2 hover:from-primary/10 hover:to-primary/5",
        success:
            "border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/50 dark:from-green-950/30 to-green-50/20 dark:to-green-900/10 hover:from-green-100/50 hover:to-green-50/30",
        warning:
            "border-yellow-200/50 dark:border-yellow-800/50 bg-gradient-to-br from-yellow-50/50 dark:from-yellow-950/30 to-yellow-50/20 dark:to-yellow-900/10 hover:from-yellow-100/50 hover:to-yellow-50/30",
        danger: "border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/50 dark:from-red-950/30 to-red-50/20 dark:to-red-900/10 hover:from-red-100/50 hover:to-red-50/30",
    };
    const iconClasses = {
        primary: "text-primary",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        danger: "text-red-600 dark:text-red-400",
    };

    return (
        <Card
            className={`border transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${colorClasses[color]}`}
            onClick={onClick}
        >
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <Icon className={`w-6 h-6 ${iconClasses[color]}`} />
                        </div>
                        {trend && (
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1 bg-green-100/60 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                            {label}
                        </p>
                        <p className="text-3xl font-black mt-1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400">
                            {value}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {subtext}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PerformanceStatsGrid({
    stats,
    upcomingJobs,
    rating,
    formatCurrency,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumStatCard
                icon={Briefcase}
                label="Missions Done"
                value={stats.completed}
                subtext="This month"
                color="primary"
                trend="+15%"
            />
            <PremiumStatCard
                icon={Star}
                label="Your Rating"
                value={`${rating}★`}
                subtext="Outstanding"
                color="warning"
            />
            <PremiumStatCard
                icon={DollarSign}
                label="Total Earned"
                value={formatCurrency(stats.earnings)}
                subtext="All time"
                color="success"
            />
            <PremiumStatCard
                icon={Flame}
                label="Current Streak"
                value={`${upcomingJobs.length}`}
                subtext="Upcoming"
                color="danger"
            />
        </div>
    );
}
