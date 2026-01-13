import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Loader2,
    User,
    Mail,
    Phone,
    Lock,
    KeyRound,
    AlertCircle,
    CheckCircle2,
    Save,
    X,
    Briefcase,
    Info,
} from "lucide-react";
import { useUpdateProfile } from "@/Hooks/useAuth";

// ============== EDIT PROFILE MODAL ==============
export default function UserEditProfileModal({
    user,
    editor,
    isOpen,
    onClose,
}) {
    const updateMutation = useUpdateProfile();
    const [status, setStatus] = useState({ type: null, message: "" });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        current_password: "",
        role: "",
    });

    const isSelfEdit = editor && user && editor.id === user.id;
    const editorIsAdmin = editor?.role === "admin";

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                current_password: "",
                role: user.role || "client",
            });
            setStatus({ type: null, message: "" });
        }
    }, [user, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus({ type: null, message: "" });

        if (!formData.current_password) {
            setStatus({
                type: "error",
                message: isSelfEdit
                    ? "Please enter your current password to save your changes."
                    : "Please enter your admin password to confirm this update.",
            });
            return;
        }

        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        if (!editorIsAdmin) delete payload.role;

        updateMutation.mutate(
            { id: user.id, data: payload },
            {
                onSuccess: () => {
                    setStatus({
                        type: "success",
                        message: isSelfEdit
                            ? "Your profile has been updated successfully! 🎉"
                            : "User profile has been updated successfully! 🎉",
                    });
                    setFormData((prev) => ({
                        ...prev,
                        password: "",
                        current_password: "",
                    }));
                    setTimeout(() => {
                        onClose();
                        setStatus({ type: null, message: "" });
                    }, 1500);
                },
                onError: (err) => {
                    console.error("Update Error:", err);
                    let errorMsg = "An error occurred while updating.";
                    if (err.response && err.response.status === 422) {
                        const errors = err.response.data.errors;
                        if (errors?.current_password) {
                            errorMsg = errors.current_password[0];
                        } else if (errors?.email) {
                            errorMsg = errors.email[0];
                        } else {
                            errorMsg =
                                err.response.data.message ||
                                "Validation failed.";
                        }
                    } else if (err.response && err.response.data.message) {
                        errorMsg = err.response.data.message;
                    }
                    setStatus({ type: "error", message: errorMsg });
                },
            }
        );
    };

    const canEditEmail = editorIsAdmin;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                {isSelfEdit
                                    ? "Edit Your Profile"
                                    : "Edit User Profile"}
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-sm">
                                {isSelfEdit
                                    ? "Update your personal information. Confirm with your current password for security."
                                    : "You are editing this user's account. Confirm changes with your admin password."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {status.message && (
                        <Alert
                            className={`animate-in slide-in-from-top-2 ${
                                status.type === "success"
                                    ? "border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20"
                                    : "border-red-200 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20"
                            }`}
                        >
                            {status.type === "success" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                            <AlertTitle
                                className={
                                    status.type === "success"
                                        ? "text-green-900 dark:text-green-300"
                                        : "text-red-900 dark:text-red-300"
                                }
                            >
                                {status.type === "success"
                                    ? "Success"
                                    : "Error"}
                            </AlertTitle>
                            <AlertDescription
                                className={
                                    status.type === "success"
                                        ? "text-green-800 dark:text-green-400"
                                        : "text-red-800 dark:text-red-400"
                                }
                            >
                                {status.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2.5">
                            <Label className="flex items-center gap-2 font-semibold">
                                <User className="w-4 h-4 text-primary" />
                                Full Name
                            </Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                                disabled={updateMutation.isPending}
                                className="h-11 rounded-lg"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2.5">
                            <Label className="flex items-center gap-2 font-semibold">
                                <Mail className="w-4 h-4 text-primary" />
                                Email Address
                            </Label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={
                                    !canEditEmail || updateMutation.isPending
                                }
                                placeholder="your@email.com"
                                required
                                className="h-11 rounded-lg"
                            />
                            {!canEditEmail && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Only administrators can change email
                                    addresses
                                </p>
                            )}
                        </div>

                        {/* Role - Admin only */}
                        {editorIsAdmin && !isSelfEdit && (
                            <div className="space-y-2.5">
                                <Label className="flex items-center gap-2 font-semibold">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    User Role
                                </Label>
                                <select
                                    name="role"
                                    className="w-full h-11 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm bg-background hover:border-primary/40 transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    disabled={updateMutation.isPending}
                                >
                                    <option value="client">👤 Client</option>
                                    <option value="sweepstar">
                                        ⭐ Sweepstar (Worker)
                                    </option>
                                    <option value="admin">
                                        🔑 Administrator
                                    </option>
                                </select>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Switch between client, sweepstar, or admin
                                    roles
                                </p>
                            </div>
                        )}

                        {/* Phone */}
                        <div className="space-y-2.5">
                            <Label className="flex items-center gap-2 font-semibold">
                                <Phone className="w-4 h-4 text-primary" />
                                Phone Number
                            </Label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="(Optional) +1 (555) 000-0000"
                                disabled={updateMutation.isPending}
                                className="h-11 rounded-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Optional - helps clients reach you
                            </p>
                        </div>

                        {/* Password Section */}
                        <div className="pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-700 space-y-4">
                            <div className="space-y-2.5">
                                <Label className="flex items-center gap-2 font-semibold text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                    New Password
                                </Label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Leave blank to keep current password"
                                    disabled={updateMutation.isPending}
                                    className="h-11 rounded-lg"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional - leave blank to keep your current
                                    password
                                </p>
                            </div>

                            {/* Security Confirmation */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 dark:from-amber-900/20 to-orange-50/50 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-foreground font-bold">
                                        <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        {isSelfEdit
                                            ? "Current Password"
                                            : "Admin Password"}
                                        <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-semibold">
                                            REQUIRED
                                        </span>
                                    </Label>
                                </div>

                                <Input
                                    name="current_password"
                                    type="password"
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                    placeholder={
                                        isSelfEdit
                                            ? "Enter your current password"
                                            : "Enter your admin password"
                                    }
                                    className="h-11 rounded-lg bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-800/50 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                                    required
                                    disabled={updateMutation.isPending}
                                />

                                <p className="text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    For security, you must confirm with your
                                    password before changes are applied.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-slate-100/50 dark:to-slate-900/50 flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            updateMutation.isPending ||
                            !formData.current_password
                        }
                        className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
