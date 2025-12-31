import React, { useState } from "react";
import { useClientContext } from "@/Helper/ClientContext";

import UserInfo from "@/layout/NavBar/component/UserInfo";
import AvailableJobs from "../Sweepstar/AvailableJobs";
import MySchedule from "../Sweepstar/MySchedule";

export default function SweepstarDashboard({ activePage }) {
    const { user } = useClientContext();
    const [isAvailable, setIsAvailable] = useState(true);
    const HnadelContent = () => {
        switch (activePage) {
            case "available":
                return <AvailableJobs />;
            case "schedule":
                return <MySchedule />;
            case "my-info":
                return <UserInfo />;
            case "dashboard":
            default:
                return (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        {/* Header with Availability Toggle */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 rounded-xl border bg-card shadow-sm">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    My Workspace
                                </h1>
                                <p className="text-muted-foreground">
                                    Hello {user.name}, ready to work?
                                </p>
                            </div>

                            <div className="flex items-center space-x-3 bg-muted/50 p-2 rounded-lg">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Status:
                                </span>
                                <button
                                    onClick={() => setIsAvailable(!isAvailable)}
                                    className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                            ${isAvailable ? "bg-green-500" : "bg-gray-400"}
                        `}
                                >
                                    <span
                                        className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${isAvailable ? "translate-x-6" : "translate-x-1"}
                        `}
                                    />
                                </button>
                                <span
                                    className={`text-sm font-bold ${
                                        isAvailable
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {isAvailable ? "Available" : "Offline"}
                                </span>
                            </div>
                        </div>

                        {/* Upcoming Jobs Section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-foreground">
                                Upcoming Jobs
                            </h2>

                            {/* Empty State (Since we have no bookings yet) */}
                            <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card/50">
                                <div className="mx-auto h-12 w-12 text-muted-foreground mb-3">
                                    📅
                                </div>
                                <h3 className="text-lg font-medium text-foreground">
                                    No jobs assigned yet
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    When a client books a service, it will
                                    appear here.
                                </p>
                            </div>
                        </div>

                        {/* Performance Mini-Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-card border border-border">
                                <p className="text-sm text-muted-foreground">
                                    Jobs Completed
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    0
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border border-border">
                                <p className="text-sm text-muted-foreground">
                                    Rating
                                </p>
                                <p className="text-2xl font-bold text-yellow-500">
                                    5.0 ★
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border border-border">
                                <p className="text-sm text-muted-foreground">
                                    This Week
                                </p>
                                <p className="text-2xl font-bold text-green-500">
                                    $0.00
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };
    return <>{HnadelContent()}</>;
}
