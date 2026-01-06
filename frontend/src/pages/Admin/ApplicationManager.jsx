// src/pages/Admin/ApplicationManager.jsx
import React, { useState } from "react";
import { Check, X, FileText, ShieldAlert, Loader, Search } from "lucide-react";

import {
    usePendingApplications,
    useApproveApplication,
    useRejectApplication,
} from "@/Hooks/useSweepstar";

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

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Reviewing applications...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-600 space-y-2">
                <ShieldAlert className="w-8 h-8" />
                <p>Failed to load applications. Please try again.</p>
            </div>
        );
    }

    // Filter logic
    const filteredApps = applications.filter((app) => {
        const term = searchTerm.toLowerCase();
        return (
            app.user?.name?.toLowerCase().includes(term) ||
            app.user?.email?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Sweepstar Applications
                    </h1>
                    <p className="text-muted-foreground">
                        Review and manage pending worker requests.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {applications.length === 0 ? (
                    // Empty State (no pending in DB)
                    <div className="text-center py-16 px-4">
                        <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            No Pending Applications
                        </h3>
                        <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                            Great job! You have reviewed all current applicants.
                        </p>
                    </div>
                ) : filteredApps.length === 0 ? (
                    // No Search Results
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No applicants found matching "{searchTerm}"
                        </p>
                    </div>
                ) : (
                    // Data Table
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                                <tr>
                                    <th className="p-4">Applicant</th>
                                    <th className="p-4">ID Number</th>
                                    <th className="p-4">Requested Rate</th>
                                    <th className="p-4 hidden md:table-cell">
                                        Bio
                                    </th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredApps.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {app.user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {app.user?.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {app.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">
                                                {app.id_number}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-green-600 flex items-center gap-1">
                                                ${app.hourly_rate}
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    /hr
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell max-w-xs">
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                                <p
                                                    className="truncate"
                                                    title={app.bio}
                                                >
                                                    {app.bio ||
                                                        "No bio provided."}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                {/* Reject */}
                                                <button
                                                    onClick={() =>
                                                        handleReject(app.id)
                                                    }
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 disabled:opacity-60"
                                                    title="Reject"
                                                    disabled={
                                                        rejectMutation.isPending
                                                    }
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>

                                                {/* Approve */}
                                                <button
                                                    onClick={() =>
                                                        handleApprove(
                                                            app.id,
                                                            app.user?.name
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-60"
                                                    disabled={
                                                        approveMutation.isPending
                                                    }
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Approve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
