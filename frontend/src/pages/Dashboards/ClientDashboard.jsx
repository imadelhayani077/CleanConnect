import React from "react";
import { useUser } from "@/Hooks/useAuth";
import {
    Sparkles,
    Calendar,
    MapPin,
    ArrowRight,
    Clock,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
    const { data: user } = useUser();
    const navigate = useNavigate();
    // Helper component for the Dashboard Cards
    const DashboardCard = ({ title, description, icon: Icon, onClick }) => (
        <div
            onClick={onClick}
            className="group p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {description}
                    </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
            {/* 1. Hero / Welcome Section */}
            <div className="relative overflow-hidden bg-primary/5 p-8 md:p-10 rounded-3xl border border-primary/10">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium text-muted-foreground mb-4">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        <span>Top-rated cleaning services</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Welcome back, {user?.name || "Guest"}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                        Your home deserves to shine. Ready to book your next
                        professional cleaning session?
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {/* Note: In a real app, this button should likely toggle the activePage state via a parent handler */}
                        <button
                            onClick={() => {
                                navigate("/dashboard/booking");
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Book a Cleaning
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Decorative Background Icon */}
                <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-primary/5 rotate-12" />
            </div>

            {/* 2. Quick Status Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Active Bookings"
                    description="You have no upcoming bookings scheduled."
                    icon={Calendar}
                />
                <DashboardCard
                    title="Saved Addresses"
                    description="Manage your home and office locations."
                    icon={MapPin}
                />
                <DashboardCard
                    title="Previous History"
                    description="View receipts and past cleaning details."
                    icon={Clock}
                />
            </div>

            {/* 3. Trust / Info Section */}
            <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    Why choose CleanConnect?
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <p>✓ Vetted & Background-checked Professionals</p>
                    <p>✓ 100% Satisfaction Guarantee</p>
                    <p>✓ Secure Cashless Payment</p>
                </div>
            </div>
        </div>
    );
}
