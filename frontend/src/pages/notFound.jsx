import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/Hooks/useAuth";

export default function NotFound() {
    const { data: user } = useUser();

    // Map backend roles to their main dashboards
    const roleDashboard = {
        client: "/client",
        sweepstar: "/sweepstar",
        admin: "/admin",
    };

    const dashboardLink =
        user && user.role && roleDashboard[user.role]
            ? roleDashboard[user.role]
            : "/dashboard";

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="max-w-lg w-full space-y-8 text-center">
                <div className="space-y-2">
                    <p className="text-xm font-medium tracking-[0.25em] text-muted-foreground uppercase">
                        404 · Not found
                    </p>
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        The page you’re looking for has been cleaned up.
                    </h1>
                </div>

                <p className="text-sm md:text-base text-muted-foreground">
                    It might have been moved, deleted, or the link is incorrect.
                    Use one of the options below to get back to your workspace.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition"
                    >
                        Go to homepage
                    </Link>

                    {!user && (
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                        >
                            Sign in to your account
                        </Link>
                    )}

                    {user && (
                        <Link
                            to={dashboardLink}
                            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                        >
                            Back to your dashboard
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
