import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessBookingModal() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-6">
            <Card className="max-w-lg w-full rounded-2xl border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-background dark:from-emerald-900/20 dark:to-background backdrop-blur-sm border-border/60 animate-in zoom-in-95 duration-300">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                    <div className="p-4 rounded-full bg-emerald-100/60 dark:bg-emerald-900/20">
                        <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">
                            Booking Confirmed!
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            We've received your request and will assign a
                            sweepstar shortly.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Button
                            variant="outline"
                            className="rounded-lg border-border/60 hover:bg-muted/50 flex-1"
                            onClick={() =>
                                navigate("/dashboard/bookings_history")
                            }
                        >
                            View Booking
                        </Button>
                        <Button
                            className="rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all flex-1 gap-2 font-semibold"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
