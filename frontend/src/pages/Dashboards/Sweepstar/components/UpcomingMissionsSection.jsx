import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MissionCard from "./MissionCard";

export default function UpcomingMissionsSection({ upcomingJobs, navigate }) {
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Upcoming Missions</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {upcomingJobs.length} scheduled mission
                        {upcomingJobs.length !== 1 ? "s" : ""}
                    </p>
                </div>
                {upcomingJobs.length > 0 && (
                    <Button
                        onClick={() => navigate("/dashboard/schedule")}
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-xl"
                    >
                        <CalendarClock className="w-4 h-4" />
                        Full Calendar
                    </Button>
                )}
            </div>

            {upcomingJobs.length > 0 ? (
                <div className="space-y-4">
                    {upcomingJobs.slice(0, 6).map((job, idx) => (
                        <MissionCard
                            key={job.id}
                            job={job}
                            index={idx + 1}
                            onView={() => navigate("/dashboard/schedule")}
                        />
                    ))}
                </div>
            ) : (
                <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <CalendarClock className="w-12 h-12 text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">
                            No Missions Yet
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Enable your status to start receiving missions from
                            nearby clients.
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
