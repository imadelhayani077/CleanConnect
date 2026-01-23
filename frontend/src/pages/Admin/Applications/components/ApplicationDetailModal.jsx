import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, DollarSign, FileText, Hash, User } from "lucide-react";
import { getInitials, getAvatarUrl } from "@/utils/avatarHelper";

export default function ApplicationDetailModal({ application, open, onClose }) {
    if (!application) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden rounded-2xl border-border/60 bg-background/95 backdrop-blur-sm">
                {/* Header */}
                <DialogHeader className="p-6 border-b border-border/60 bg-muted/20">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                            <AvatarImage
                                src={getAvatarUrl(application.user)}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                {getInitials(application.user?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {application.user?.name}
                            </DialogTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Mail className="w-3.5 h-3.5" />
                                {application.user?.email}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                <DollarSign className="w-3.5 h-3.5" />
                                Hourly Rate
                            </div>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ${application.hourly_rate}
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    /hr
                                </span>
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                <Hash className="w-3.5 h-3.5" />
                                ID Number
                            </div>
                            <p className="text-lg font-mono font-medium text-foreground">
                                {application.id_number}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Bio Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <FileText className="w-4 h-4 text-primary" />
                            About the Applicant
                        </div>
                        <div className="p-4 rounded-lg bg-muted/20 text-sm leading-relaxed text-muted-foreground border border-border/40">
                            {application.bio ||
                                "No bio provided by this applicant."}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <span>Applicant ID: {application.id}</span>
                        <Badge variant="outline" className="capitalize">
                            Status: Pending
                        </Badge>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
