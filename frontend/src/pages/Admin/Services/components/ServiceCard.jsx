// src/pages/admin/components/ServiceCard.jsx
import React from "react";
import { Pencil, Trash2, Eye, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ServiceCard({ service, onEdit, onDelete, onDetails }) {
    // Construct image URL
    const imageUrl = service.service_icon
        ? `http://localhost:8000${service.service_icon}`
        : null;

    return (
        <Card className="group overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-8 pb-6 flex flex-col items-center justify-center space-y-4">
                {/* 1. Service Icon (Centered) */}
                <div className="w-24 h-24 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-105 transition-transform duration-300">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={service.name}
                            className="w-16 h-16 object-contain p-2"
                        />
                    ) : (
                        <Briefcase className="w-12 h-12 text-primary/40" />
                    )}
                </div>

                {/* 2. Service Name */}
                <div className="text-center">
                    <h3 className="font-bold text-xl tracking-tight text-foreground">
                        {service.name}
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                        Service Category
                    </p>
                </div>
            </CardContent>

            {/* 3. Action Buttons (Footer) */}
            <CardFooter className="p-4 bg-muted/30 grid grid-cols-3 gap-2 border-t">
                <TooltipProvider>
                    {/* Details Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                onClick={() => onDetails(service)}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                    </Tooltip>

                    {/* Edit Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full hover:bg-primary hover:text-primary-foreground"
                                onClick={() => onEdit(service)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Service</TooltipContent>
                    </Tooltip>

                    {/* Delete Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => onDelete(service.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Service</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardFooter>
        </Card>
    );
}
