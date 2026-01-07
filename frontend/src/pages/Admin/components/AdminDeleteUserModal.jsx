import React, { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { useAdminDeleteUser } from "@/Hooks/useUsers";

export default function AdminDeleteUserModal({ user, isOpen, onClose }) {
    const { mutateAsync: deleteUser, isPending } = useAdminDeleteUser();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setError("");
        try {
            await deleteUser({ id: user.id, password });
            onClose();
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
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                        Confirm Deletion
                    </DialogTitle>
                    <DialogDescription>
                        You are about to delete <strong>{user?.name}</strong>.
                        Enter YOUR admin password to confirm.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Admin Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
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
                        disabled={isPending || !password}
                    >
                        {isPending ? "Deleting..." : "Confirm Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
