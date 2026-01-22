// src/components/applications/ApplicationsTable.jsx
import React from "react";
import {
    Check,
    X,
    FileText,
    UserCheck,
    DollarSign,
    Loader2,
} from "lucide-react";

import { getInitials, getAvatarUrl } from "@/utils/avatarHelper";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApplicationsTable({
    applications,
    searchTerm,
    onApprove,
    onReject,
    isApproving,
    isRejecting,
}) {
    const hasSearch = searchTerm.trim().length > 0;

    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/60 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Pending Applications
                </CardTitle>
                <CardDescription>
                    {applications.length} applicant
                    {applications.length !== 1 ? "s" : ""} to review
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
                                            {hasSearch
                                                ? `No applicants found matching "${searchTerm}"`
                                                : "No pending applications"}
                                        </p>
                                        {!hasSearch && (
                                            <p className="text-sm text-muted-foreground/70">
                                                Great! You've reviewed all
                                                applicants.
                                            </p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr
                                    key={app.id}
                                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-border/60">
                                                <AvatarImage
                                                    src={getAvatarUrl(app.user)}
                                                    alt={app.user?.name}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-bold">
                                                    {getInitials(
                                                        app.user?.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
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

                                    <td className="px-6 py-4">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-xs bg-muted/50 border-border/60"
                                        >
                                            {app.id_number}
                                        </Badge>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {app.hourly_rate}
                                            <span className="text-xs text-muted-foreground font-normal">
                                                /hr
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 hidden lg:table-cell max-w-xs">
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                            <p
                                                className="truncate"
                                                title={app.bio}
                                            >
                                                {app.bio || "No bio provided"}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                onClick={() => onReject(app.id)}
                                                disabled={isRejecting}
                                                title="Reject application"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="h-8 gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all"
                                                onClick={() =>
                                                    onApprove(
                                                        app.id,
                                                        app.user?.name,
                                                    )
                                                }
                                                disabled={isApproving}
                                            >
                                                {isApproving ? (
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
    );
}
