import { Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmptyScheduleState({ onFindJobs }) {
    return (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 dark:from-slate-900/30 to-slate-100/30 dark:to-slate-900/10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

            <CardContent className="relative z-10 flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4 animate-bounce">
                    <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">
                    Your Schedule is Clear ✨
                </h3>

                <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                    You don't have any upcoming jobs. Start your earning journey
                    by accepting available opportunities!
                </p>

                <Button
                    onClick={onFindJobs}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg h-11 px-8 font-semibold rounded-lg group"
                >
                    <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Find Available Jobs
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
            </CardContent>
        </Card>
    );
}
