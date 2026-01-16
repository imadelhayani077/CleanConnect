import React, { useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { useUpdateAvatar } from "@/Hooks/useAuth";

export default function AvatarUpload({ user }) {
    const fileInputRef = useRef(null);
    const { mutateAsync: updateAvatar, isPending } = useUpdateAvatar();

    // We can show the user's current avatar, or a default
    const currentAvatarUrl = user?.avatar_url || user?.avatar;

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation (Optional but good)
        if (file.size > 2 * 1024 * 1024) {
            // 2MB
            alert("File is too large. Max 2MB.");
            return;
        }

        // Create FormData (Required for files)
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            await updateAvatar(formData);
            // Success! The useUpdateAvatar hook will auto-refresh the UI
            // You can add a toast here if you like
            // toast.success("Profile picture updated!");
        } catch (error) {
            alert("Failed to upload image.");
        }
    };

    return (
        <div className="relative group w-24 h-24 mx-auto mb-6">
            {/* 1. The Image Container */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-700 relative">
                {currentAvatarUrl ? (
                    <img
                        src={currentAvatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-10 h-10" />
                    </div>
                )}

                {/* Loading Overlay */}
                {isPending && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}
            </div>

            {/* 2. The Camera Button (Triggers file input) */}
            <button
                onClick={() => fileInputRef.current.click()}
                disabled={isPending}
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:scale-105 z-10 cursor-pointer"
                title="Change Profile Picture"
            >
                <Camera className="w-4 h-4" />
            </button>

            {/* 3. Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileSelect}
            />
        </div>
    );
}
