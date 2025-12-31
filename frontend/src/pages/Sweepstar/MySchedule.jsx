import React, { useEffect, useState } from "react";
import { useBooking } from "@/Helper/BookingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function MySchedule() {
    const { fetchMySchedule } = useBooking();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSchedule = async () => {
            setLoading(true);
            const data = await fetchMySchedule();
            setJobs(data || []);
            setLoading(false);
        };
        loadSchedule();
    }, []);

    if (loading)
        return <div className="p-8 text-center">Loading schedule...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                📅 My Upcoming Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <p className="text-muted-foreground col-span-full">
                        You have no upcoming jobs.
                    </p>
                ) : (
                    jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="border-l-4 border-l-blue-500 bg-muted/20"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <Badge variant="outline">
                                        {job.service_type}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                        Confirmed
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2">
                                    {job.address?.street_address}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="font-semibold text-foreground">
                                        {format(
                                            new Date(job.scheduled_at),
                                            "PPP p"
                                        )}
                                    </span>
                                </div>
                                {job.notes && (
                                    <div className="bg-yellow-50 text-yellow-800 p-2 rounded text-xs border border-yellow-200">
                                        Note: {job.notes}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
