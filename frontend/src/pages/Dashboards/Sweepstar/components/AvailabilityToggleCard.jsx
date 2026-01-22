import { Loader2, CheckCircle2, Activity, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AvailabilityToggleCard({
    isAvailable,
    isToggling,
    toggleAvailability,
    navigate,
}) {
    return (
        <Card className="w-full max-w-sm shadow-2xl border-primary/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <CardContent className="pt-8 space-y-6">
                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                        Your Status
                    </p>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                        <span
                            className={`font-bold text-sm ${isAvailable ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}`}
                        >
                            {isAvailable ? "🟢 Online" : "⚫ Offline"}
                        </span>
                    </div>
                </div>
                <Button
                    onClick={() => toggleAvailability()}
                    disabled={isToggling}
                    size="lg"
                    className={`w-full font-bold text-base rounded-xl transition-all duration-300 ${
                        isAvailable
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-700 dark:to-slate-800 text-white hover:shadow-lg"
                    }`}
                >
                    {isToggling ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : isAvailable ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Go Offline
                        </>
                    ) : (
                        <>
                            <Activity className="w-4 h-4 mr-2" />
                            Go Online
                        </>
                    )}
                </Button>
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        {isAvailable
                            ? "✅ Visible to clients nearby"
                            : "❌ Not receiving offers"}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 rounded-lg"
                            onClick={() => navigate("/dashboard/settings")}
                        >
                            <Target className="w-3 h-3 mr-1" />
                            Settings
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 rounded-lg"
                            onClick={() => navigate("/dashboard/profile")}
                        >
                            <Award className="w-3 h-3 mr-1" />
                            Profile
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
