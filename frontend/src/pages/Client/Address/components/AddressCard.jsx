// src/components/address/AddressCard.jsx
import React from "react";
import { Home, Loader2, Trash2, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AddressCard({ address, onDelete, isDeleting, onEdit }) {
    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm group hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden">
            {/* Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-primary to-primary/60" />

            <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    {/* Badge */}
                    <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                        <Home className="w-3 h-3" />
                        Saved Address
                    </Badge>

                    {/* Delete Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-all"
                        onClick={() => onDelete(address.id)}
                        disabled={isDeleting}
                        title="Delete address"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {/* Address Details */}
                <div className="space-y-3">
                    {/* Street Address */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                                Street Address
                            </p>
                            <p className="font-semibold text-foreground line-clamp-2">
                                {address.street_address}
                            </p>
                        </div>
                    </div>

                    {/* City & Postal Code */}
                    <div className="flex items-center gap-4 pt-2 border-t border-border/40">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                City
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                {address.city}
                            </p>
                        </div>
                        {address.postal_code && (
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                    Postal Code
                                </p>
                                <p className="text-sm font-medium text-foreground font-mono">
                                    {address.postal_code}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-4 border-t border-border/40">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg text-xs font-semibold border-border/60 hover:bg-muted/50 group/btn"
                        onClick={() => onEdit(address)}
                    >
                        <Pencil className="w-3 h-3 mr-1.5 group-hover/btn:translate-y-0.5 transition-transform" />
                        Edit This Address
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
