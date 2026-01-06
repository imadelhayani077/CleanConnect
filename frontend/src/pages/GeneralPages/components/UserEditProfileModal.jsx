// src/layout/NavBar/component/UserEditProfileModal.jsx
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
} from "lucide-react";

import { useUpdateProfile } from "@/Hooks/useAuth";

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
        if (!editorIsAdmin) delete payload.role; // only admin can send role

        updateMutation.mutate(
            { id: user.id, data: payload },
            {
                onSuccess: () => {
                    setStatus({
                        type: "success",
                        message: isSelfEdit
                            ? "Your profile has been updated successfully."
                            : "User profile has been updated successfully.",
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b bg-background">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {isSelfEdit ? "Edit your profile" : "Edit user profile"}
                    </DialogTitle>
                    <DialogDescription>
                        {isSelfEdit
                            ? "Update your personal information. For security, confirm with your current password."
                            : "You are editing this user’s account. Confirm the changes with your admin password."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {status.message && (
                        <div className="mb-2">
                            <Alert
                                variant={
                                    status.type === "success"
                                        ? "default"
                                        : "destructive"
                                }
                                className={
                                    status.type === "success"
                                        ? "border-green-500/50 text-green-700 bg-green-50"
                                        : ""
                                }
                            >
                                {status.type === "success" ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {status.type === "success"
                                        ? "Success"
                                        : "Error"}
                                </AlertTitle>
                                <AlertDescription>
                                    {status.message}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        id="edit-profile-form"
                    >
                        {/* Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="flex items-center gap-2"
                            >
                                <User className="w-4 h-4 text-muted-foreground" />
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Full name"
                                required
                                disabled={updateMutation.isPending}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={
                                    !canEditEmail || updateMutation.isPending
                                }
                                placeholder="Email address"
                                required
                            />
                            {!canEditEmail && (
                                <p className="text-xs text-muted-foreground">
                                    Only an admin can change the email address.
                                </p>
                            )}
                        </div>

                        {/* Role (only when admin edits another user) */}
                        {editorIsAdmin && !isSelfEdit && (
                            <div className="space-y-2">
                                <Label
                                    htmlFor="role"
                                    className="flex items-center gap-2"
                                >
                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                    Role
                                </Label>
                                <select
                                    id="role"
                                    name="role"
                                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    disabled={updateMutation.isPending}
                                >
                                    <option value="client">Client</option>
                                    <option value="sweepstar">Sweepstar</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    As admin you can switch this account between
                                    client, sweepstar, or admin.
                                </p>
                            </div>
                        )}

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Optional phone number"
                                disabled={updateMutation.isPending}
                            />
                        </div>

                        {/* New Password + Current/Admin Password */}
                        <div className="pt-4 border-t border-dashed space-y-3">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center gap-2 text-muted-foreground"
                                >
                                    <Lock className="w-4 h-4" />
                                    New Password (optional)
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Leave blank to keep current password"
                                    disabled={updateMutation.isPending}
                                />
                            </div>

                            <div className="p-4 bg-orange-50/50 rounded-lg border border-orange-200/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="current_password"
                                        className="flex items-center gap-2 text-foreground font-semibold"
                                    >
                                        <KeyRound className="w-4 h-4 text-orange-500" />
                                        {isSelfEdit
                                            ? "Current Password"
                                            : "Admin Password"}
                                        <span className="text-xs text-destructive font-semibold">
                                            *
                                        </span>
                                    </Label>
                                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                        Required to save changes
                                    </span>
                                </div>

                                <Input
                                    id="current_password"
                                    name="current_password"
                                    type="password"
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                    placeholder={
                                        isSelfEdit
                                            ? "Enter your current password to confirm"
                                            : "Enter your admin password to confirm"
                                    }
                                    className="bg-background border-orange-200 focus-visible:ring-orange-500"
                                    required
                                    disabled={updateMutation.isPending}
                                />

                                <p className="text-xs text-muted-foreground">
                                    For security, you must enter this password
                                    before any changes are applied.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-background">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-profile-form"
                        disabled={
                            updateMutation.isPending ||
                            !formData.current_password
                        }
                        className="gap-2"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
