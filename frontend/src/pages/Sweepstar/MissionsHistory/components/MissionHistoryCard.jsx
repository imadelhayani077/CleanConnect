import { useState } from "react";
import { format } from "date-fns";
import { MapPin, Clock, Trophy, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MissionDetailModal from "../../AvailableMissions/components/MissionDetailModal";

export default function MissionHistoryCard({ job }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scheduledDate = new Date(job.scheduled_at);
    const isCompleted = job.status === "completed";

    // Handle directions button click (Open in Google Maps)
    const handleDirections = () => {
        if (job.address) {
            const query = `${job.address.street_address}, ${job.address.city}`;
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                "_blank",
            );
        }
    };

    // Color Logic for completed vs cancelled
    const theme = isCompleted
        ? {
              border: "from-green-500 via-green-400 to-green-300",
              badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
              iconBg: "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400",
              cardBorder: "border-green-200/50 dark:border-green-900/20",
          }
        : {
              border: "from-red-500 via-red-400 to-red-300",
              badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
              iconBg: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400",
              cardBorder: "border-red-200/50 dark:border-red-900/20 opacity-90",
          };

    // Options and Extras (from updated backend model)
    const selectedOptions = job.booking_services[0]?.selected_options?.map(
        (option) => option.option?.name,
    );
    const selectedExtras = job.booking_services[0]?.selected_extras?.map(
        (extra) => extra.extra?.name,
    );

    return (
        <>
            <Card
                className={`group relative overflow-hidden transition-all hover:shadow-lg border ${theme.cardBorder}`}
            >
                {/* Top Gradient */}
                <div className={`h-1.5 bg-gradient-to-r ${theme.border}`} />

                <div className="absolute top-4 right-4">
                    <Badge className={`${theme.badge} shadow-sm border-0`}>
                        {isCompleted ? "Completed" : "Cancelled"}
                    </Badge>
                </div>

                <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                        <img
                            className="w-15 h-15"
                            src={`http://localhost:8000${
                                job.booking_services[0]?.service?.service_icon
                            }`}
                            alt={job.booking_services[0]?.service?.name}
                        />
                        <div>
                            <Badge variant="outline" className="mb-1.5 text-xs">
                                {job.booking_services[0]?.service?.name ||
                                    "Cleaning Mission"}
                            </Badge>
                            <CardTitle className="text-lg md:text-xl line-clamp-1">
                                {job.address?.city || "Location"}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.address?.street_address || "—"}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5 pb-5">
                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-3 gap-3 opacity-80">
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                {format(scheduledDate, "MMM")}
                            </p>
                            <p className="text-xl font-bold text-foreground">
                                {format(scheduledDate, "d")}
                            </p>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border flex items-center justify-between">
                                <span className="text-xs uppercase text-muted-foreground font-bold">
                                    {format(scheduledDate, "EEEE")}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {format(scheduledDate, "yyyy")}
                                </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                    {format(scheduledDate, "h:mm a")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Options and Extras */}
                    {selectedOptions && selectedOptions.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-semibold">
                                Options
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {selectedOptions.map((option, idx) => (
                                    <Badge
                                        key={idx}
                                        className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                    >
                                        {option}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedExtras && selectedExtras.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-semibold">
                                Extras
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {selectedExtras.map((extra, idx) => (
                                    <Badge
                                        key={idx}
                                        className="bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
                                    >
                                        {extra}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Details
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <MissionDetailModal
                booking={job}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
