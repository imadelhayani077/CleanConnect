// src/layout/NavBar/component/UserInfo.jsx
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Loader2,
    User,
    Mail,
    Phone,
    Lock,
    Edit2,
    Save,
    X,
    ShieldCheck,
    KeyRound,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { useUser, useUpdateProfile } from "@/Hooks/useAuth";
import { getRoleStyles } from "@/utils/roleStyles"; // <-- shared role styles

export default function UserInfo() {
    const { data: user, isLoading } = useUser();
    const updateMutation = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);

    // Status state for alerts
    const [status, setStatus] = useState({ type: null, message: "" });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        current_password: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                current_password: "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (isEditing) setStatus({ type: null, message: "" });
    }, [isEditing]);

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

                    setIsEditing(false);

                    setFormData((prev) => ({
                        ...prev,
                        password: "",
                        current_password: "",
                    }));

                    setTimeout(
                        () => setStatus({ type: null, message: "" }),
                        5000
                    );
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

    const handleCancel = () => {
        setIsEditing(false);
        setStatus({ type: null, message: "" });
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
            current_password: "",
        });
    };

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="p-10 flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (!user) return null;

    const isAdmin = user.role === "admin";
    const isEmailDisabled = !isEditing || (!isAdmin && isEditing);

    return (
        <Card className="w-full shadow-md border-border/60 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
                <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        My Profile
                    </CardTitle>
                    <CardDescription>
                        Manage your personal account details.
                    </CardDescription>
                </div>

                <Badge
                    className={`uppercase px-3 py-1 text-xs font-semibold tracking-wide ${getRoleStyles(
                        user.role
                    )}`}
                >
                    {user.role}
                </Badge>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Alerts */}
                {status.message && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <Alert
                            variant={
                                status.type === "error"
                                    ? "destructive"
                                    : "default"
                            }
                            className={
                                status.type === "success"
                                    ? "border-green-500/50 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/10"
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

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column: Avatar & Summary */}
                        <div className="flex flex-col items-center gap-4 md:w-1/3">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-xl text-foreground">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    ID: #{user.id}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Inputs */}
                        <div className="flex-1 space-y-5">
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
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Email Address
                                    {!isAdmin && isEditing && (
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
                                    disabled={isEmailDisabled}
                                    className={`bg-background ${
                                        isEmailDisabled
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                />
                            </div>

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
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>

                            {/* Editing only fields */}
                            {isEditing && (
                                <div className="pt-4 border-t border-dashed space-y-5 animate-in fade-in slide-in-from-top-2">
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
                                            placeholder="Leave empty to keep current"
                                            className="bg-background"
                                        />
                                    </div>

                                    <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 space-y-3">
                                        <Label
                                            htmlFor="current_password"
                                            className="flex items-center gap-2 text-foreground font-semibold"
                                        >
                                            <KeyRound className="w-4 h-4 text-orange-500" />
                                            Current Password (required)
                                        </Label>
                                        <Input
                                            id="current_password"
                                            name="current_password"
                                            type="password"
                                            value={formData.current_password}
                                            onChange={handleInputChange}
                                            placeholder="Enter current password"
                                            className="bg-background border-orange-200 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
                        {!isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="gap-2"
                            >
                                <Edit2 className="w-4 h-4" /> Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={updateMutation.isPending}
                                >
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                                <Button
                                    type="submit"
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
                            </>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
