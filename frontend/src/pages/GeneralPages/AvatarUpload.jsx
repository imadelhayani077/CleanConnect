import React, { useRef, useState } from "react";
import { Camera, Loader2, User, AlertCircle } from "lucide-react";
import { useUpdateAvatar } from "@/Hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getAvatarUrl } from "@/utils/avatarHelper";

const AVATAR_CONFIG = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ACCEPTED_FORMATS: "image/jpeg,image/png,image/webp",
};

export default function AvatarUpload({ user, editable = true, size = "lg" }) {
    const fileInputRef = useRef(null);
    const { mutateAsync: updateAvatar, isPending } = useUpdateAvatar();
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    const currentAvatarUrl = getAvatarUrl(user);
    const userInitials = getInitials(user?.name);

    const sizeClasses = {
        sm: "h-16 w-16",
        md: "h-20 w-20",
        lg: "h-32 w-32",
        xl: "h-40 w-40",
    };

    const buttonSizeClasses = {
        sm: "h-6 w-6 p-1",
        md: "h-7 w-7 p-1.5",
        lg: "h-10 w-10 p-2",
        xl: "h-12 w-12 p-2.5",
    };

    const validateFile = (file) => {
        setError("");

        if (!file) return false;

        // Check file type
        if (!AVATAR_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
            setError("Please upload a JPG, PNG, or WebP image.");
            return false;
        }

        // Check file size
        if (file.size > AVATAR_CONFIG.MAX_SIZE) {
            setError("File is too large. Maximum size is 5MB.");
            return false;
        }

        return true;
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];

        if (!validateFile(file)) {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload file
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            await updateAvatar(formData);
            // Clear preview and input on success
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            const errorMessage =
                err?.response?.data?.message || "Failed to upload image";
            setError(errorMessage);
            setPreviewUrl(null);
        }
    };

    const displayUrl = previewUrl || currentAvatarUrl;
    const isLoading = isPending;

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Avatar Container */}
            <div className="relative group">
                {/* Main Avatar - Using shadcn Avatar */}
                <Avatar
                    className={`${sizeClasses[size]} border-4 border-border/60`}
                >
                    <AvatarImage
                        src={displayUrl}
                        alt={user?.name || "Profile"}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                )}

                {/* Upload Button - Only show if editable */}
                {editable && (
                    <>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            size="icon"
                            className={`absolute bottom-1 right-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10 ${buttonSizeClasses[size]}`}
                            title="Change profile picture"
                            aria-label="Upload profile picture"
                        >
                            <Camera
                                className={`${size === "lg" ? "h-5 w-5" : "h-4 w-4"}`}
                            />
                        </Button>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept={AVATAR_CONFIG.ACCEPTED_FORMATS}
                            onChange={handleFileSelect}
                            disabled={isLoading}
                            aria-hidden="true"
                        />
                    </>
                )}
            </div>

            {/* User Info - Show name and email */}
            {user && (
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">
                        {user?.name || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {user?.email}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60 w-full max-w-sm">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Info Text - Show upload requirements */}
            {editable && (
                <p className="text-xs text-muted-foreground text-center max-w-sm">
                    JPG, PNG, or WebP • Max 5MB • Click the camera icon to
                    upload
                </p>
            )}
        </div>
    );
}
