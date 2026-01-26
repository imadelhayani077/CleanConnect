// src/pages/admin/components/ServiceCard.jsx
import React from "react";
import { Pencil, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ServiceCard({ service, onEdit, onDelete }) {
    // Construct image URL (adjust base URL to match your Laravel config)
    const imageUrl = service.service_icon // Changed from service_icon to image_path based on your backend
        ? `http://localhost:8000${service.service_icon}`
        : null;

    return (
        <Card className="group overflow-hidden rounded-xl border-border/60 hover:shadow-md transition-all duration-300 bg-card">
            {/* Image Area */}
            <div className="relative h-48 w-full bg-muted/20 overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={service.name}
                        // UPDATED: 'object-contain' prevents cropping. 'p-6' gives it space.
                        className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-secondary/20 text-muted-foreground">
                        <Briefcase className="h-12 w-12 opacity-20" />
                    </div>
                )}

                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                    <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-background/80 font-bold text-foreground border-border/50 shadow-sm"
                    >
                        ${Number(service.base_price).toFixed(2)}
                    </Badge>
                </div>
            </div>

            {/* Content Area */}
            <CardContent className="p-5">
                <h3
                    className="font-semibold text-lg tracking-tight mb-2 line-clamp-1"
                    title={service.name}
                >
                    {service.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {service.description || "No description provided."}
                </p>
            </CardContent>

            {/* Actions Footer */}
            <CardFooter className="p-4 pt-0 flex gap-3 border-t bg-muted/5 mt-auto">
                <Button
                    variant="outline"
                    className="flex-1 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                    onClick={() => onEdit(service)}
                >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                    variant="outline"
                    className="flex-none w-12 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                    onClick={() => onDelete(service.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
