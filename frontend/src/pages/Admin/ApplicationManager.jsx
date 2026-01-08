// src/pages/admin/ApplicationManager.jsx
import React, { useState } from "react";
import {
    Check,
    X,
    FileText,
    AlertTriangle,
    Loader2,
    Search,
    UserCheck,
    DollarSign,
    AlertCircle,
} from "lucide-react";

import {
    usePendingApplications,
    useApproveApplication,
    useRejectApplication,
} from "@/Hooks/useSweepstar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function ApplicationManager() {
    // React Query hooks
    const {
        data: applications = [],
        isLoading,
        isError,
    } = usePendingApplications();

    const approveMutation = useApproveApplication();
    const rejectMutation = useRejectApplication();

    const [searchTerm, setSearchTerm] = useState("");

    const handleApprove = async (id, name) => {
        if (
            window.confirm(
                `Are you sure you want to promote ${name} to Sweepstar?`
            )
        ) {
            try {
                await approveMutation.mutateAsync(id);
            } catch (e) {
                console.error("Approve failed", e);
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Reject this application? This cannot be undone.")) {
            try {
                await rejectMutation.mutateAsync(id);
            } catch (e) {
                console.error("Reject failed", e);
            }
        }
    };

    // Filter logic
    const filteredApps = applications.filter((app) => {
        const term = searchTerm.toLowerCase();
        return (
            app.user?.name?.toLowerCase().includes(term) ||
            app.user?.email?.toLowerCase().includes(term)
        );
    });

    // Loading state
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

    // Error state
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

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pending Applications
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {applications.length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-primary/10">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Avg. Requested Rate
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {applications.length > 0
                                        ? `$${(
                                              applications.reduce(
                                                  (sum, app) =>
                                                      sum +
                                                      parseFloat(
                                                          app.hourly_rate || 0
                                                      ),
                                                  0
                                              ) / applications.length
                                          ).toFixed(2)}`
                                        : "$0"}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/20">
                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Filtered Results
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {filteredApps.length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100/60 dark:bg-blue-900/20">
                                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/60 pb-4">
                    <CardTitle className="text-lg">Search & Filter</CardTitle>
                    <CardDescription>
                        Find applicants by name or email
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Applications Table */}
            <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/60 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        Pending Applications
                    </CardTitle>
                    <CardDescription>
                        {filteredApps.length} applicant
                        {filteredApps.length !== 1 ? "s" : ""} to review
                    </CardDescription>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/60 bg-muted/30 hover:bg-muted/30">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    ID Number
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Hourly Rate
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                                    Bio
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {applications.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <UserCheck className="w-12 h-12 text-muted-foreground/20" />
                                            <p className="font-medium text-muted-foreground">
                                                No pending applications
                                            </p>
                                            <p className="text-sm text-muted-foreground/70">
                                                Great! You've reviewed all
                                                applicants.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center"
                                    >
                                        <p className="text-muted-foreground">
                                            No applicants found matching "
                                            {searchTerm}"
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                                    >
                                        {/* Applicant */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {app.user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-foreground truncate">
                                                        {app.user?.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {app.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ID Number */}
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className="font-mono text-xs bg-muted/50 border-border/60"
                                            >
                                                {app.id_number}
                                            </Badge>
                                        </td>

                                        {/* Hourly Rate */}
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {app.hourly_rate}
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    /hr
                                                </span>
                                            </div>
                                        </td>

                                        {/* Bio */}
                                        <td className="px-6 py-4 hidden lg:table-cell max-w-xs">
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                                <p
                                                    className="truncate"
                                                    title={app.bio}
                                                >
                                                    {app.bio ||
                                                        "No bio provided"}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                    onClick={() =>
                                                        handleReject(app.id)
                                                    }
                                                    disabled={
                                                        rejectMutation.isPending
                                                    }
                                                    title="Reject application"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    className="h-8 gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all"
                                                    onClick={() =>
                                                        handleApprove(
                                                            app.id,
                                                            app.user?.name
                                                        )
                                                    }
                                                    disabled={
                                                        approveMutation.isPending
                                                    }
                                                >
                                                    {approveMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            Approving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="w-3 h-3" />
                                                            Approve
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
