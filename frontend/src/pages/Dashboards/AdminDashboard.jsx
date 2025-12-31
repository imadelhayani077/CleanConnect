import React, { useEffect, useState } from "react";
import ClientApi from "@/Services/ClientApi"; // Make sure you add the new API call here later
import { useClientContext } from "@/Helper/ClientContext";
import BookingManager from "../Admin/BookingManager";
import UsersList from "../Admin/UsersListe";
import UserInfo from "@/layout/NavBar/component/UserInfo";
import ApplicationManager from "../Admin/ApplicationManager";
import ServiceManager from "../Admin/ServiceManager";

// Simple Reusable Card Component using your Theme
const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {title}
                </p>
                <h3 className="text-3xl font-bold mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-full opacity-20 ${colorClass}`}>
                {/* We can replace this with Lucide Icons later */}
                <span className="text-xl">📊</span>
            </div>
        </div>
    </div>
);

export default function AdminDashboard({ activePage }) {
    const { user } = useClientContext();
    const [stats, setStats] = useState({
        total_users: 0,
        total_sweepstars: 0,
        active_bookings: 0,
        revenue: 0,
    });

    // Fetch Real Data
    useEffect(() => {
        // You need to add this method to your ClientApi.js:
        // getAdminStats: () => axiosClient.get('/admin/stats')

        // Simulating API call for now:
        // ClientApi.getAdminStats().then(({data}) => setStats(data));

        // Mock data to see the design immediately
        setStats({
            total_users: 12,
            total_sweepstars: 5,
            active_bookings: 3,
            revenue: 1250,
        });
    }, []);
    const HnadelContent = () => {
        switch (activePage) {
            case "users":
                return <UsersList />; // Shows the table we made earlier
            case "my-info":
                return <UserInfo />;
            case "Applications":
                return <ApplicationManager />;
            case "bookings":
                return <BookingManager />;
            case "services":
                return <ServiceManager />;
            case "dashboard":
            default:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Admin Overview
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Welcome back, {user.name}
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:opacity-90 transition">
                                Download Report
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Clients"
                                value={stats.total_users}
                                colorClass="bg-blue-500"
                            />
                            <StatCard
                                title="Active Sweepstars"
                                value={stats.total_sweepstars}
                                colorClass="bg-purple-500"
                            />
                            <StatCard
                                title="Active Bookings"
                                value={stats.active_bookings}
                                colorClass="bg-orange-500"
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`$${stats.revenue}`}
                                colorClass="bg-green-500"
                            />
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">
                                    Recent Registrations
                                </h3>
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        No new users today.
                                    </div>
                                    {/* Map through users here later */}
                                </div>
                            </div>

                            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">
                                    System Status
                                </h3>
                                <div className="flex items-center space-x-2 text-green-500">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-sm font-medium">
                                        System Operational
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };
    return <>{HnadelContent()}</>;
}
