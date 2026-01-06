// src/.../UsersListe.jsx

import React, { useState } from "react";

import { useUsers } from "@/Hooks/useUsers";
import { useUser } from "@/Hooks/useAuth";

import {
    Loader2,
    Search,
    ShieldAlert,
    User,
    Briefcase,
    FilterX,
    RefreshCcw,
    Eye,
    X,
    Pencil,
} from "lucide-react";

import { getRoleStyles } from "@/utils/roleStyles";

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

import UserDetailModal from "./components/UserDetailModal";
import UserEditProfileModal from "../GeneralPages/components/UserEditProfileModal";

export default function UsersList() {
    const { users, loading, error, refetch } = useUsers();
    const { data: currentUser } = useUser(); // logged-in user (admin)

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleOpenDetails = (userId) => {
        setSelectedUserId(userId);
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
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">
                    Loading users...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500 space-y-4">
                <ShieldAlert className="h-12 w-12" />
                <p className="text-lg font-semibold">Error Loading Users</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={refetch}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            User Management
                        </h2>
                        <p className="text-muted-foreground">
                            Manage {users.length} registered users.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={refetch}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh Data
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Directory</CardTitle>
                        <CardDescription>
                            Filter clients and sweepstars.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9"
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
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Role" />
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
                                onClick={() => {
                                    setSearchTerm("");
                                    setRoleFilter("all");
                                }}
                            >
                                <FilterX className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">
                                            ID
                                        </TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <FilterX className="h-6 w-6 mb-2 opacity-20" />
                                                    <p>No users found.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    #{user.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                                {getInitials(
                                                                    user.name
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">
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
                                                        className={`uppercase px-3 py-1 text-xs font-semibold tracking-wide ${getRoleStyles(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {user.created_at
                                                        ? new Date(
                                                              user.created_at
                                                          ).toLocaleDateString()
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Details toggle */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="px-2"
                                                            onClick={() =>
                                                                setSelectedUserId(
                                                                    selectedUserId ===
                                                                        user.id
                                                                        ? null
                                                                        : user.id
                                                                )
                                                            }
                                                            title={
                                                                selectedUserId ===
                                                                user.id
                                                                    ? "Close details"
                                                                    : "View details"
                                                            }
                                                        >
                                                            {selectedUserId ===
                                                            user.id ? (
                                                                <>
                                                                    <X className="w-4 h-4 mr-1" />
                                                                    <span className="hidden sm:inline text-xs">
                                                                        Close
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    <span className="hidden sm:inline text-xs">
                                                                        Details
                                                                    </span>
                                                                </>
                                                            )}
                                                        </Button>

                                                        {/* Edit button (admin only) */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() =>
                                                                handleEditUser(
                                                                    user
                                                                )
                                                            }
                                                            title="Edit user"
                                                            disabled={
                                                                !currentUser ||
                                                                currentUser.role !==
                                                                    "admin"
                                                            }
                                                        >
                                                            <Pencil className="w-4 h-4 mr-1" />
                                                            <span className="hidden sm:inline text-xs">
                                                                Edit
                                                            </span>
                                                        </Button>
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

            {/* Detail modal */}
            {selectedUserId && (
                <UserDetailModal
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={handleCloseDetails}
                />
            )}

            {/* Edit modal (shared with profile) */}
            {selectedUserForEdit && currentUser && (
                <UserEditProfileModal
                    user={selectedUserForEdit}
                    editor={currentUser}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                />
            )}
        </>
    );
}
