// src/components/applications/ApplicationManager.jsx
import React, { useState } from "react";
import { UserCheck, Loader2, AlertCircle } from "lucide-react";

import {
    usePendingApplications,
    useApproveApplication,
    useRejectApplication,
} from "@/Hooks/useSweepstar";

import { Alert, AlertDescription } from "@/components/ui/alert";
import ApplicationsStatCards from "./components/ApplicationsStatCards";
import ApplicationSearch from "./components/ApplicationsSearch";
import ApplicationsTable from "./components/ApplicationsTable";
import ApplicationDetailModal from "./components/ApplicationDetailModal"; // [!code focus]

export default function ApplicationManager() {
    const {
        data: applications = [],
        isLoading,
        isError,
    } = usePendingApplications();

    const approveMutation = useApproveApplication();
    const rejectMutation = useRejectApplication();

    const [searchTerm, setSearchTerm] = useState("");

    // [!code focus] State for selected application modal
    const [selectedApp, setSelectedApp] = useState(null);

    const filteredApps = applications.filter((app) => {
        const term = searchTerm.toLowerCase();
        return (
            (app.user?.name || "").toLowerCase().includes(term) ||
            (app.user?.email || "").toLowerCase().includes(term)
        );
    });

    const handleApprove = async (id, name) => {
        if (!name) return;
        if (
            !window.confirm(
                `Are you sure you want to promote ${name} to Sweepstar?`,
            )
        ) {
            return;
        }
        try {
            await approveMutation.mutateAsync(id);
        } catch (err) {
            console.error("Approve failed", err);
        }
    };

    const handleReject = async (id) => {
        if (
            !window.confirm("Reject this application? This cannot be undone.")
        ) {
            return;
        }
        try {
            await rejectMutation.mutateAsync(id);
        } catch (err) {
            console.error("Reject failed", err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">
                        Loading applications...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-300">
                        Failed to load applications. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const avgRate =
        applications.length > 0
            ? (
                  applications.reduce(
                      (sum, app) => sum + Number(app.hourly_rate || 0),
                      0,
                  ) / applications.length
              ).toFixed(2)
            : "0.00";

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <UserCheck className="w-6 h-6 text-primary" />
                        </div>
                        Sweepstar Applications
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Review and approve pending worker applications
                    </p>
                </div>
            </div>

            <ApplicationsStatCards
                applicationsCount={applications.length}
                filteredCount={filteredApps.length}
                avgRate={avgRate}
            />

            <ApplicationSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <ApplicationsTable
                applications={filteredApps}
                searchTerm={searchTerm}
                onApprove={handleApprove}
                onReject={handleReject}
                isApproving={approveMutation.isPending}
                isRejecting={rejectMutation.isPending}
                // [!code focus] Pass the handler to the table
                onViewDetails={setSelectedApp}
            />

            {/* [!code focus] Render the Detail Modal */}
            <ApplicationDetailModal
                application={selectedApp}
                open={!!selectedApp}
                onClose={() => setSelectedApp(null)}
            />
        </div>
    );
}
