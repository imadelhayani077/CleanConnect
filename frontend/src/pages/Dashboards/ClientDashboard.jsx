import React from "react";
import { useUser } from "@/Hooks/useAuth";
import { useDashboard } from "@/Hooks/useDashboard";
import {
    Sparkles,
    Calendar,
    MapPin,
    ArrowRight,
    ShieldCheck,
    Loader2,
    Wallet,
    CheckCircle2,
    Zap,
    Award,
    Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// shadcn/ui Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import DisabledOverlay from "../auth/DisabledOverlay";

export default function ClientDashboard() {
    const { data: user } = useUser();
    const { clientStats, isClientLoading } = useDashboard();
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    const DashboardCard = ({
        title,
        value,
        description,
        icon: Icon,
        onClick,
        highlight = false,
    }) => (
        <Card
            onClick={onClick}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                highlight
                    ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/60"
                    : "hover:border-primary/40"
            }`}
        >
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-primary transition-colors">
                            {title}
                        </p>
                        <p className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                            {value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <div
                        className={`p-4 rounded-xl flex-shrink-0 transition-all duration-300 ${
                            highlight
                                ? "bg-primary/20 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:scale-110"
                                : "bg-muted group-hover:bg-primary/10"
                        }`}
                    >
                        <Icon
                            className={`w-6 h-6 transition-all ${
                                highlight
                                    ? "text-primary group-hover:text-white"
                                    : "text-muted-foreground group-hover:text-primary"
                            }`}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const TrustCard = ({ icon: Icon, title, description, color }) => (
        <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/40">
            <CardContent className="pt-6">
                <div
                    className={`inline-flex p-3 rounded-lg mb-4 ${
                        color === "green"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : color === "red"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                >
                    <Icon
                        className={`w-6 h-6 ${
                            color === "green"
                                ? "text-green-600 dark:text-green-400"
                                : color === "red"
                                ? "text-red-600 dark:text-red-400"
                                : "text-blue-600 dark:text-blue-400"
                        }`}
                    />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );

    if (isClientLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (user?.status === "disabled") {
        return <DisabledOverlay />;
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-8 md:p-12">
                {/* Decorative Background */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <Badge variant="outline" className="mb-4 bg-background">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Professional cleaning at your fingertips
                    </Badge>

                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                            {getGreeting()},{" "}
                            {user?.name?.split(" ")[0] || "Guest"}! 👋
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            Your trusted partner in keeping your spaces
                            sparkling clean. Let's make your home shine today.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button
                            onClick={() => navigate("/dashboard/booking")}
                            className="gap-2 h-11 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg"
                        >
                            <Zap className="w-4 h-4" />
                            Book a Cleaning Now
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() =>
                                navigate("/dashboard/booking-history")
                            }
                            variant="outline"
                            className="gap-2 h-11"
                        >
                            <Calendar className="w-4 h-4" />
                            View History
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Upcoming Jobs"
                    value={clientStats?.data.active_bookings || 0}
                    description="Clean sessions scheduled for you"
                    icon={Calendar}
                    onClick={() => navigate("/dashboard/booking-history")}
                    highlight={clientStats?.data.active_bookings > 0}
                />

                <DashboardCard
                    title="Your Addresses"
                    value={clientStats?.data.address_count || 0}
                    description="Locations ready for booking"
                    icon={MapPin}
                    onClick={() => navigate("/dashboard/address")}
                />

                <DashboardCard
                    title="Total Invested"
                    value={formatCurrency(clientStats?.data.total_spent)}
                    description={`${
                        clientStats?.total_bookings || 0
                    } perfect cleanings`}
                    icon={Wallet}
                    onClick={() => navigate("/dashboard/booking-history")}
                />
            </div>

            {/* Why Choose Us Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TrustCard
                    icon={ShieldCheck}
                    title="Vetted Professionals"
                    description="All our cleaners are background-checked & verified"
                    color="green"
                />
                <TrustCard
                    icon={Heart}
                    title="100% Satisfaction"
                    description="Not happy? We'll make it right, guaranteed"
                    color="red"
                />
                <TrustCard
                    icon={Zap}
                    title="Fast & Secure"
                    description="Easy booking with secure cashless payments"
                    color="blue"
                />
            </div>

            {/* CTA Section for New Users */}
            {clientStats?.data.active_bookings === 0 && (
                <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
                    <Award className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-lg">
                        Ready for a Fresh Start?
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                        Book your first cleaning session today and experience
                        the CleanConnect difference. Our expert team is ready to
                        make your space shine!
                    </AlertDescription>
                    <Button
                        onClick={() => navigate("/dashboard/booking")}
                        className="mt-4 gap-2"
                        size="sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        Schedule Your Cleaning
                    </Button>
                </Alert>
            )}

            {/* Stats Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-muted border">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">
                        Member since{" "}
                        {new Date(user?.created_at).toLocaleDateString()}
                    </span>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm font-medium">
                        {clientStats?.data.total_bookings || 0} bookings
                        completed
                    </p>
                </div>
            </div>
        </div>
    );
}
