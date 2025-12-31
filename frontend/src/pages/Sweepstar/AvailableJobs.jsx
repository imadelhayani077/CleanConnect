import React, { useEffect, useState } from "react";
import { useBooking } from "@/Helper/BookingContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AvailableJobs() {
    const { fetchAvailableJobs, acceptJobAssignment } = useBooking();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        setLoading(true);
        const data = await fetchAvailableJobs();
        setJobs(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleAccept = async (id) => {
        const result = await acceptJobAssignment(id);
        if (result.success) {
            toast.success("Job Accepted!");
            loadJobs(); // Refresh list to remove the taken job
        } else {
            toast.error(result.message);
        }
    };

    if (loading)
        return <div className="p-8 text-center">Loading opportunities...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                🚀 Available Opportunities
                <Badge variant="secondary">{jobs.length}</Badge>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <p className="text-muted-foreground col-span-full">
                        No new jobs available right now.
                    </p>
                ) : (
                    jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="hover:shadow-lg transition-all border-l-4 border-l-green-500"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <Badge>{job.service_type}</Badge>
                                    <span className="font-bold text-green-700 text-lg flex items-center">
                                        <DollarSign className="w-4 h-4" />
                                        {job.total_price}
                                    </span>
                                </div>
                                <CardTitle className="text-lg mt-2">
                                    {job.address?.city}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2 text-muted-foreground">
                                <div className="flex gap-2">
                                    <Calendar className="w-4 h-4" />{" "}
                                    {format(new Date(job.scheduled_at), "PPP")}
                                </div>
                                <div className="flex gap-2">
                                    <Clock className="w-4 h-4" />{" "}
                                    {format(new Date(job.scheduled_at), "p")}
                                </div>
                                <div className="flex gap-2">
                                    <MapPin className="w-4 h-4" />{" "}
                                    {job.address?.street_address}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleAccept(job.id)}
                                >
                                    Accept Job
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
