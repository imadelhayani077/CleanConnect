import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getAvatarUrl } from "@/utils/avatarHelper";

export default function MissionCard({ job, index, onView }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-300";
            case "pending":
                return "bg-yellow-100/60 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
            default:
                return "bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
        }
    };

    return (
        <Card className="group border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-primary/40">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-6">
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-black text-lg text-primary group-hover:scale-110 transition-transform">
                            {index}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-border/60">
                                    <AvatarImage
                                        src={getAvatarUrl(job.user)}
                                        alt={job.user?.name}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                        {getInitials(job.user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-foreground text-sm">
                                    {job.user?.name || "Client"}
                                </span>
                            </div>
                            <Badge
                                className={`w-fit text-xs font-semibold ${getStatusColor(job.status)}`}
                            >
                                {job.status || "confirmed"}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="font-medium text-foreground">
                                    {new Date(
                                        job.scheduled_at,
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                                <span className="text-muted-foreground">
                                    {new Date(
                                        job.scheduled_at,
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground truncate">
                                    {job.address?.street_address},{" "}
                                    {job.address?.city}
                                </span>
                            </div>
                        </div>
                        {job.services && job.services.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {job.services.slice(0, 3).map((service) => (
                                    <Badge
                                        key={service.id}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {service.name}
                                    </Badge>
                                ))}
                                {job.services.length > 3 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        +{job.services.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-black text-primary">
                                ${job.total_price}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {job.duration_hours}h
                            </p>
                        </div>
                        <Button
                            onClick={onView}
                            size="icon"
                            variant="ghost"
                            className="rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
