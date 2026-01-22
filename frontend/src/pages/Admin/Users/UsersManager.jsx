// src/pages/admin/users/UsersManager.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Users, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { useUser } from "@/Hooks/useAuth";
import { useUsers } from "@/Hooks/useUsers"; // adjust import path if needed
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import UsersStatCards from "./components/UsersStatCards";
import UsersFilter from "./components/UsersFilter";
import UsersTable from "./components/UsersTable";

import UserDetailModal from "./components/UserDetailModal";
import AdminDeleteUserModal from "./components/AdminDeleteUserModal";
import UserEditProfileModal from "../../SharedComponents/components/UserEditProfileModal";

export default function UsersManager() {
    const { users, loading, error, refetch } = useUsers();
    const { data: currentUser } = useUser();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const location = useLocation();

    // Open user detail from notification / link
    useEffect(() => {
        if (location.state?.openUserId) {
            setSelectedUserId(location.state.openUserId);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (user.name || "").toLowerCase().includes(term) ||
            (user.email || "").toLowerCase().includes(term) ||
            String(user.id || "").includes(term);

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4 p-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground text-lg">
                    Loading users...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-300">
                        {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            User Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and monitor {users.length} registered users
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={refetch}
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                <UsersStatCards users={users} />

                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <CardTitle className="text-2xl">
                            User Directory
                        </CardTitle>
                        <CardDescription>
                            Filter and manage all users in the system
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <UsersFilter
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            roleFilter={roleFilter}
                            setRoleFilter={setRoleFilter}
                        />

                        <UsersTable
                            users={filteredUsers}
                            currentUser={currentUser}
                            selectedUserId={selectedUserId}
                            setSelectedUserId={setSelectedUserId}
                            setSelectedUserForEdit={setSelectedUserForEdit}
                            setIsEditModalOpen={setIsEditModalOpen}
                            setUserToDelete={setUserToDelete}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            {selectedUserId && (
                <UserDetailModal
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}

            {selectedUserForEdit && currentUser && (
                <UserEditProfileModal
                    user={selectedUserForEdit}
                    editor={currentUser}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUserForEdit(null);
                        refetch();
                    }}
                />
            )}

            {userToDelete && (
                <AdminDeleteUserModal
                    isOpen={!!userToDelete}
                    user={userToDelete}
                    onClose={() => setUserToDelete(null)}
                />
            )}
        </>
    );
}
