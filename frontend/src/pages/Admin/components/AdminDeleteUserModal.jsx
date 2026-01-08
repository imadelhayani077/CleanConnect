// src/pages/admin/components/AdminDeleteUserModal.jsx
import React, { useState } from "react";
import { Loader2, ShieldAlert, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminDeleteUser } from "@/Hooks/useUsers";

export default function AdminDeleteUserModal({ user, isOpen, onClose }) {
    const { mutateAsync: deleteUser, isPending } = useAdminDeleteUser();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [confirmText, setConfirmText] = useState("");

    const handleDelete = async () => {
        setError("");

        if (confirmText !== user?.name) {
            setError(`Please type "${user?.name}" to confirm deletion.`);
            return;
        }

        try {
            await deleteUser({ id: user.id, password });
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.response?.data?.errors?.password?.[0] ||
                    "Failed to delete user. Please try again."
            );
        }
    };

    const isValid = password && confirmText === user?.name;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl border-border/60 bg-background/80 backdrop-blur-xl gap-6">
                {/* Header */}
                <DialogHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-red-100/60 dark:bg-red-900/20">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                                Delete User?
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-2">
                                This action cannot be undone. You are about to
                                permanently delete{" "}
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    {user?.name}
                                </span>
                                and all their associated data.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Alert Box */}
                <Alert className="border-orange-200/60 bg-orange-50/50 dark:bg-orange-900/20 dark:border-orange-800/60">
                    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-300 text-sm">
                        Deleting this user will remove all their bookings,
                        reviews, and profile information permanently.
                    </AlertDescription>
                </Alert>

                {/* Content */}
                <div className="space-y-5 py-4">
                    {/* Confirmation Text Input */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-sm font-semibold text-foreground">
                                Type the user's name to confirm
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Enter{" "}
                                <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-semibold">
                                    {user?.name}
                                </span>{" "}
                                to proceed
                            </p>
                        </div>
                        <Input
                            placeholder={user?.name || "User name"}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="rounded-lg bg-muted/40 border-border/60 focus:border-red-500/50"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-sm font-semibold text-foreground">
                                Enter Your Admin Password
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                For security, confirm with your admin password
                            </p>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg bg-muted/40 border-border/60 focus:border-red-500/50"
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    isValid &&
                                    !isPending
                                ) {
                                    handleDelete();
                                }
                            }}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="flex-col-reverse sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        className="rounded-lg border-border/60 hover:bg-muted/50"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!isValid || isPending}
                        className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Confirm Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
