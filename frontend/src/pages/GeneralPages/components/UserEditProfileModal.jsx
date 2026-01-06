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
} from "lucide-react";
import { useUpdateProfile } from "@/Hooks/useAuth";

export default function UserEditProfileModal({ user, isOpen, onClose }) {
    const updateMutation = useUpdateProfile();

    // Status state for alerts
    const [status, setStatus] = useState({ type: null, message: "" });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        current_password: "",
    });

    // Load user data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                current_password: "",
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

        // Security Check
        if (!formData.current_password) {
            setStatus({
                type: "error",
                message:
                    "Security check: Please enter your current password to save changes.",
            });
            return;
        }

        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        updateMutation.mutate(
            {
                id: user.id,
                data: payload,
            },
            {
                onSuccess: () => {
                    setStatus({
                        type: "success",
                        message: "Profile updated successfully!",
                    });

                    // Clear sensitive fields
                    setFormData((prev) => ({
                        ...prev,
                        password: "",
                        current_password: "",
                    }));

                    // Close modal after short delay
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

    const isAdmin = user?.role === "admin";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b bg-background z-10">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Update your personal information securely.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Alerts */}
                    {status.message && (
                        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Alert
                                variant={
                                    status.type === "error"
                                        ? "destructive"
                                        : "default"
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
                        id="edit-profile-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="flex items-center gap-2"
                            >
                                <User className="w-4 h-4 text-muted-foreground" />{" "}
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={updateMutation.isPending}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4 text-muted-foreground" />{" "}
                                Email Address
                                {!isAdmin && (
                                    <span className="text-xs text-red-500 font-normal ml-auto">
                                        (Contact admin to change)
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                // Logic: Only admin can edit email, or nobody if you prefer strict rules
                                disabled={!isAdmin || updateMutation.isPending}
                                className={
                                    !isAdmin
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4 text-muted-foreground" />{" "}
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={updateMutation.isPending}
                            />
                        </div>

                        {/* Password Section */}
                        <div className="pt-4 border-t border-dashed space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center gap-2 text-muted-foreground"
                                >
                                    <Lock className="w-4 h-4" /> New Password
                                    (Optional)
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Leave empty to keep current"
                                />
                            </div>

                            <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 space-y-3">
                                <Label
                                    htmlFor="current_password"
                                    className="flex items-center gap-2 text-foreground font-semibold"
                                >
                                    <KeyRound className="w-4 h-4 text-orange-500" />
                                    Current Password (Required)
                                </Label>
                                <Input
                                    id="current_password"
                                    name="current_password"
                                    type="password"
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                    placeholder="Enter current password to confirm"
                                    className="bg-background border-orange-200 focus:ring-orange-500"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <DialogFooter className="p-6 pt-2 border-t bg-background">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                    >
                        <X className="w-4 h-4 mr-2" /> Cancel
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
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
