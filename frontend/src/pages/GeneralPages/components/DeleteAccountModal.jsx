import React, { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
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

export default function DeleteAccountModal({ isOpen, onClose }) {
    const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();
    const [password, setPassword] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setError("");
        try {
            await deleteAccount({ password, reason });
            // Redirect handled in hook
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.response?.data?.errors?.password?.[0] ||
                    "Failed to delete."
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Delete Account
                    </DialogTitle>
                    <DialogDescription>
                        This action is permanent. Please tell us why you are
                        leaving and confirm your password.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Reason for leaving</Label>
                        <Textarea
                            placeholder="I'm not using the service anymore..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 font-medium">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending || !password || !reason}
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
