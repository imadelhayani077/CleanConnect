import React from "react";
import { Lock, Power, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleStatus, useLogout } from "@/Hooks/useAuth";

export default function DisabledOverlay() {
    const { mutate: toggleStatus, isPending } = useToggleStatus();
    const { mutate: logout } = useLogout();

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-4 text-center">
            <div className="bg-card border border-border p-8 rounded-xl shadow-2xl max-w-md w-full space-y-6">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-yellow-600" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Account Disabled
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        You have disabled your account. Your dashboard access is
                        restricted and you will not appear in search results.
                    </p>
                </div>

                <div className="space-y-3 pt-4">
                    <Button
                        onClick={() => toggleStatus()}
                        disabled={isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Power className="w-4 h-4 mr-2" />
                        {isPending ? "Activating..." : "Re-activate Account"}
                    </Button>

                    <Button
                        onClick={() => logout()}
                        variant="outline"
                        className="w-full"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
