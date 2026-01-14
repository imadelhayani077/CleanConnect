// src/pages/admin/UsersList.jsx
import React, { useState } from "react";
import { useUser } from "@/Hooks/useAuth";
import { useUsers, useAdminUpdateStatus } from "@/Hooks/useUsers";
import {
    Loader2,
    Search,
    Trash2,
    Ban,
    CheckCircle,
    FilterX,
    RefreshCcw,
    Eye,
    EyeOff,
    Pencil,
    Users,
    AlertCircle,
} from "lucide-react";

import { getRoleStyles } from "@/utils/roleStyles";
import { useLocation } from "react-router-dom"; // <--- Import This
import { useEffect } from "react"; // <--- Import This
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Components
import UserDetailModal from "./components/Users/UserDetailModal";

import AdminDeleteUserModal from "./components/Users/AdminDeleteUserModal";
import UserEditProfileModal from "../GeneralPages/components/UserEditProfileModal";

export default function UsersList() {
    const { users, loading, error, refetch } = useUsers();
    const { data: currentUser } = useUser();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const location = useLocation();

    const updateStatusMutation = useAdminUpdateStatus();

    // 2. LISTEN FOR NOTIFICATION CLICKS
    useEffect(() => {
        // Check if we arrived here with a "openUserId" inside the state
        if (location.state?.openUserId) {
            // Set the ID to open the modal
            setSelectedUserId(location.state.openUserId);

            // Optional: Clean the state so if they refresh, it doesn't reopen
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === "active" && !u.deleted_at)
            .length,
        suspended: users.filter((u) => u.status === "suspended").length,
        deleted: users.filter((u) => u.deleted_at).length,
    };

    const getStatusStyles = (status, deletedAt) => {
        if (deletedAt)
            return "bg-gray-200 text-gray-500 border-gray-300 line-through";
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "suspended":
                return "bg-red-100 text-red-700 border-red-200";
            case "disabled":
                return "bg-orange-100 text-orange-700 border-orange-200";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleStatusChange = (userId, newStatus) => {
        if (window.confirm(`Change user status to ${newStatus}?`)) {
            updateStatusMutation.mutate({ id: userId, status: newStatus });
        }
    };

    const handleOpenDetails = (userId) => {
        setSelectedUserId(selectedUserId === userId ? null : userId);
    };

    const handleCloseDetails = () => {
        setSelectedUserId(null);
    };

    const handleEditUser = (user) => {
        setSelectedUserForEdit(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUserForEdit(null);
        refetch();
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id?.toString().includes(searchTerm);

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getInitials = (name) =>
        name
            ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
            : "U";

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
                        className="rounded-lg gap-2 border-border/60 hover:bg-muted/50"
                        onClick={refetch}
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Refresh Data
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Total Users",
                            value: stats.total,
                            icon: Users,
                            color: "bg-primary/10 text-primary",
                        },
                        {
                            label: "Active",
                            value: stats.active,
                            icon: CheckCircle,
                            color: "bg-emerald-100/60 text-emerald-600",
                        },
                        {
                            label: "Suspended",
                            value: stats.suspended,
                            icon: Ban,
                            color: "bg-red-100/60 text-red-600",
                        },
                        {
                            label: "Deleted",
                            value: stats.deleted,
                            icon: Trash2,
                            color: "bg-gray-100/60 text-gray-600",
                        },
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={index}
                                className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {stat.label}
                                            </p>
                                            <p className="text-3xl font-bold text-foreground mt-2">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div
                                            className={`p-3 rounded-lg ${stat.color}`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Card */}
                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl">
                                    User Directory
                                </CardTitle>
                                <CardDescription>
                                    Filter and manage all users in the system
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email or ID..."
                                    className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <Select
                                value={roleFilter}
                                onValueChange={(value) => setRoleFilter(value)}
                            >
                                <SelectTrigger className="w-full md:w-[180px] rounded-lg bg-muted/40 border-border/60">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    <SelectItem value="client">
                                        Clients
                                    </SelectItem>
                                    <SelectItem value="sweepstar">
                                        Sweepstars
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        Admins
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-lg border-border/60 hover:bg-muted/50"
                                onClick={() => {
                                    setSearchTerm("");
                                    setRoleFilter("all");
                                }}
                                title="Clear filters"
                            >
                                <FilterX className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Results count */}
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredUsers.length} of {users.length}{" "}
                                users
                            </p>
                        </div>

                        {/* Table */}
                        <div className="rounded-lg border border-border/60 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-border/60 bg-muted/30">
                                        <TableHead className="w-[80px] font-semibold">
                                            ID
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            User
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Role
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Joined
                                        </TableHead>
                                        <TableHead className="text-right font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-32"
                                            >
                                                <div className="flex flex-col items-center justify-center text-muted-foreground h-full">
                                                    <FilterX className="h-8 w-8 mb-2 opacity-30" />
                                                    <p className="font-medium">
                                                        No users found
                                                    </p>
                                                    <p className="text-xs mt-1">
                                                        Try adjusting your
                                                        filters
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                                            >
                                                <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                                                    #{user.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-border/60">
                                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-bold">
                                                                {getInitials(
                                                                    user.name
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-sm text-foreground">
                                                                {user.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`uppercase px-2.5 py-1 text-xs font-semibold tracking-wide ${getRoleStyles(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    {user.role === "admin" ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-purple-50/60 text-purple-700 border-purple-200/60 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/60"
                                                        >
                                                            System
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className={`capitalize ${getStatusStyles(
                                                                user.status,
                                                                user.deleted_at
                                                            )}`}
                                                        >
                                                            {user.deleted_at
                                                                ? "Deleted"
                                                                : user.status ||
                                                                  "Active"}
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-muted-foreground text-sm">
                                                    {user.created_at
                                                        ? new Date(
                                                              user.created_at
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  year: "numeric",
                                                                  month: "short",
                                                                  day: "numeric",
                                                              }
                                                          )
                                                        : "—"}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {/* Details Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-muted/70"
                                                            onClick={() =>
                                                                handleOpenDetails(
                                                                    user.id
                                                                )
                                                            }
                                                            title="View details"
                                                        >
                                                            {selectedUserId ===
                                                            user.id ? (
                                                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                            ) : (
                                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                        </Button>

                                                        {/* Edit Button */}
                                                        {!user.deleted_at && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 dark:hover:bg-blue-900/20"
                                                                onClick={() =>
                                                                    handleEditUser(
                                                                        user
                                                                    )
                                                                }
                                                                disabled={
                                                                    !currentUser ||
                                                                    currentUser.role !==
                                                                        "admin"
                                                                }
                                                                title="Edit user"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        )}

                                                        {/* Status Toggle */}
                                                        {!user.deleted_at &&
                                                            user.role !==
                                                                "admin" &&
                                                            user.id !==
                                                                currentUser?.id && (
                                                                <>
                                                                    {user.status !==
                                                                        "suspended" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50/60 dark:hover:bg-orange-900/20"
                                                                            title="Suspend user"
                                                                            onClick={() =>
                                                                                handleStatusChange(
                                                                                    user.id,
                                                                                    "suspended"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Ban className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                    {user.status ===
                                                                        "suspended" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
                                                                            title="Activate user"
                                                                            onClick={() =>
                                                                                handleStatusChange(
                                                                                    user.id,
                                                                                    "active"
                                                                                )
                                                                            }
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            )}

                                                        {/* Delete Button */}
                                                        {!user.deleted_at &&
                                                            currentUser?.id !==
                                                                user.id && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                                    onClick={() =>
                                                                        setUserToDelete(
                                                                            user
                                                                        )
                                                                    }
                                                                    title="Delete user"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            {selectedUserId && (
                <UserDetailModal
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={handleCloseDetails}
                />
            )}

            {selectedUserForEdit && currentUser && (
                <UserEditProfileModal
                    user={selectedUserForEdit}
                    editor={currentUser}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
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
