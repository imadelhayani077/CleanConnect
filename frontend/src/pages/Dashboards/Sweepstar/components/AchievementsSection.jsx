import {
    Award,
    Star,
    Flame,
    TrendingUp,
    Zap,
    CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AchievementBadge({ icon: Icon, title, description, unlocked }) {
    return (
        <div
            className={`p-4 rounded-xl border transition-all ${
                unlocked
                    ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 opacity-50"
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`p-2 rounded-lg ${unlocked ? "bg-primary/20" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                    <Icon
                        className={`w-5 h-5 ${unlocked ? "text-primary" : "text-slate-400 dark:text-slate-600"}`}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                        {title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                </div>
                {unlocked && (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                )}
            </div>
        </div>
    );
}

export default function AchievementsSection({ stats, rating, earnings }) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AchievementBadge
                    icon={Award}
                    title="Power Performer"
                    description="Complete 10 missions"
                    unlocked={stats.completed >= 10}
                />
                <AchievementBadge
                    icon={Star}
                    title="5-Star Specialist"
                    description="Achieve 5.0 rating"
                    unlocked={rating === 5.0}
                />
                <AchievementBadge
                    icon={Flame}
                    title="On Fire"
                    description="Complete 5 missions this week"
                    unlocked={stats.completed >= 5}
                />
                <AchievementBadge
                    icon={TrendingUp}
                    title="Consistent Earner"
                    description="Earn over $1,000"
                    unlocked={earnings >= 1000}
                />
            </div>

            <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                <Zap className="h-5 w-5 text-primary" />
                <AlertTitle className="text-foreground font-bold">
                    Keep Grinding! 🚀
                </AlertTitle>
                <AlertDescription className="text-muted-foreground mt-2">
                    You're close to unlocking "Consistent Earner" achievement.
                    Keep up the amazing work!
                </AlertDescription>
            </Alert>
        </>
    );
}
