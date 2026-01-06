// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/Hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
    const { data: user } = useUser();

    // Map backend roles to their main dashboards
    const roleDashboard = {
        client: "/dashboard",
        sweepstar: "/dashboard",
        admin: "/dashboard",
    };

    const dashboardLink =
        user && user.role && roleDashboard[user.role]
            ? roleDashboard[user.role]
            : "/dashboard";

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center px-4 py-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Error Code */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 mb-6">
                        <span className="text-5xl font-black text-primary">
                            404
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
                        Page Not Found
                    </h1>

                    <p className="text-base text-muted-foreground max-w-sm mx-auto mb-2">
                        Oops! The page you're looking for has been cleaned up or
                        moved to a new location.
                    </p>

                    <p className="text-sm text-muted-foreground/70">
                        Don't worry, let's get you back on track.
                    </p>
                </div>

                {/* Illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-48 h-32">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl" />
                        <div className="relative flex items-center justify-center h-full">
                            <div className="text-6xl">🧹</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                    <Link to="/" className="block">
                        <Button
                            size="lg"
                            className="w-full rounded-lg font-semibold h-11 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200 group"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go to Homepage
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                    {!user ? (
                        <Link to="/login" className="block">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-lg font-semibold h-11 border-border/60 hover:bg-muted/50 transition-colors group"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Sign In to Your Account
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    ) : (
                        <Link to={dashboardLink} className="block">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-lg font-semibold h-11 border-border/60 hover:bg-muted/50 transition-colors group"
                            >
                                Back to Dashboard
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Help Section */}
                <div className="rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm p-6">
                    <h3 className="font-semibold text-foreground mb-3 text-sm">
                        Quick Links
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to="/"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-2 rounded hover:bg-muted/50"
                        >
                            ← Home
                        </Link>
                        <Link
                            to="/contact"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-2 rounded hover:bg-muted/50"
                        >
                            Support →
                        </Link>
                        {!user && (
                            <>
                                <Link
                                    to="/login"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-2 rounded hover:bg-muted/50"
                                >
                                    ← Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-2 rounded hover:bg-muted/50"
                                >
                                    Sign Up →
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Error Code Display */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground/50 font-mono">
                        Error Code: 404 · Not Found
                    </p>
                </div>
            </div>
        </div>
    );
}
