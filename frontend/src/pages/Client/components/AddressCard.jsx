import React from "react";
import { Home, Loader2, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AddressCard({ address, onDelete, isDeleting }) {
    return (
        <Card className="relative group hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                    {/* Badge */}
                    <div className="flex items-center gap-2 text-primary font-semibold bg-primary/10 px-2 py-1 rounded text-xs uppercase tracking-wide">
                        <Home className="w-3 h-3" />
                        <span>Saved</span>
                    </div>

                    {/* Delete Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2 h-8 w-8 transition-colors"
                        onClick={() => onDelete(address.id)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {/* Address Details */}
                <div className="space-y-1">
                    <p className="font-semibold text-lg text-foreground line-clamp-1">
                        {address.street_address}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        {address.city}
                        {address.postal_code && (
                            <span className="opacity-75">
                                {" "}
                                • {address.postal_code}
                            </span>
                        )}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
