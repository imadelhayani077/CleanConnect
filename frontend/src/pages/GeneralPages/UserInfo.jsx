import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Mail, Phone, Edit2, ShieldCheck } from "lucide-react";
import { useUser } from "@/Hooks/useAuth";
import { getRoleStyles } from "@/utils/roleStyles";
import UserEditProfileModal from "./components/UserEditProfileModal";

export default function UserInfo() {
    const { data: user, isLoading } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    return (
        <>
            <Card className="w-full shadow-md border-border/60 bg-card/50 backdrop-blur-sm">
                {/* Card Header */}
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

                {/* Card Content - View Mode Only */}
                <CardContent className="pt-6">
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

                        {/* Right Column: Details Display */}
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Full Name Display */}
                                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <User className="w-4 h-4" /> Full Name
                                    </div>
                                    <div className="font-medium text-foreground pl-6">
                                        {user.name}
                                    </div>
                                </div>

                                {/* Email Display */}
                                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <Mail className="w-4 h-4" /> Email
                                        Address
                                    </div>
                                    <div className="font-medium text-foreground pl-6">
                                        {user.email}
                                    </div>
                                </div>

                                {/* Phone Display */}
                                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <Phone className="w-4 h-4" /> Phone
                                        Number
                                    </div>
                                    <div className="font-medium text-foreground pl-6">
                                        {user.phone || "Not provided"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Edit Button */}
                    <div className="flex justify-end mt-8 pt-4 border-t border-border">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="gap-2"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* The Edit Modal */}
            <UserEditProfileModal
                user={user}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
