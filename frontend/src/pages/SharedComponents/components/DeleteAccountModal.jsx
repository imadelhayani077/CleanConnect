import React, { useState } from "react";
import {
    Loader2,
    AlertTriangle,
    Lock,
    AlertCircle,
    X,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { useDeleteAccount } from "@/Hooks/useAuth"; // You need to update this hook (see Step 5)
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DeleteAccountModal({ isOpen, onClose }) {
    const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();
    const [password, setPassword] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [confirmText, setConfirmText] = useState("");

    const isReadyToDelete =
        password && reason && confirmText === "DELETE MY ACCOUNT";

    const handleDelete = async () => {
        setError("");
        try {
            await deleteAccount({ password, reason });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.response?.data?.errors?.password?.[0] ||
                    "Failed to delete account. Please try again."
            );
        }
    };

    const handleClose = () => {
        setPassword("");
        setReason("");
        setError("");
        setConfirmText("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {/* Header - Danger Zone */}
                <DialogHeader className="p-6 pb-4 border-b border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-50 dark:from-red-900/20 to-red-100/50 dark:to-red-900/10">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-red-700 dark:text-red-300">
                                Delete Account
                            </DialogTitle>
                            <DialogDescription className="text-red-600 dark:text-red-400 mt-2">
                                This action is permanent and cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Warning Alert */}
                    <Alert className="border-red-200 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-900 dark:text-red-300 font-bold">
                            Are you absolutely sure?
                        </AlertTitle>
                        <AlertDescription className="text-red-800 dark:text-red-400 mt-2">
                            Deleting your account will permanently remove:
                            <ul className="mt-3 space-y-2 ml-4">
                                <li>✗ Your profile and personal information</li>
                                <li>✗ All booking history and reviews</li>
                                <li>✗ Earnings and payment history</li>
                                <li>✗ Messages and communication records</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-5">
                        {/* Reason */}
                        <div className="space-y-2.5">
                            <Label className="font-semibold text-foreground">
                                Why are you leaving?
                            </Label>
                            <Textarea
                                placeholder="Your feedback helps us improve... (optional but appreciated)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={isPending}
                                className="resize-none rounded-lg min-h-[100px] focus-visible:ring-red-500"
                            />
                            <p className="text-xs text-muted-foreground">
                                Help us understand how we can serve you better
                            </p>
                        </div>

                        {/* Password Confirmation */}
                        <div className="space-y-2.5 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50">
                            <Label className="font-semibold text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                Confirm Your Password
                                <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-semibold">
                                    REQUIRED
                                </span>
                            </Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={isPending}
                                className="h-11 rounded-lg"
                            />
                        </div>

                        {/* Confirmation Text */}
                        <div className="space-y-2.5">
                            <Label className="font-semibold text-foreground flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                Type to Confirm
                                <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-semibold">
                                    REQUIRED
                                </span>
                            </Label>
                            <Input
                                type="text"
                                value={confirmText}
                                onChange={(e) =>
                                    setConfirmText(e.target.value.toUpperCase())
                                }
                                placeholder='Type "DELETE MY ACCOUNT" to confirm'
                                disabled={isPending}
                                className="h-11 rounded-lg font-mono font-bold"
                            />
                            <p className="text-xs text-muted-foreground">
                                Type exactly:{" "}
                                <span className="font-bold text-foreground">
                                    DELETE MY ACCOUNT
                                </span>
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <Alert className="border-red-200 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20 animate-in slide-in-from-top-2">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertTitle className="text-red-900 dark:text-red-300">
                                    Error
                                </AlertTitle>
                                <AlertDescription className="text-red-800 dark:text-red-400">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending || !isReadyToDelete}
                        className="gap-2 shadow-lg hover:shadow-xl"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete Account Permanently
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
