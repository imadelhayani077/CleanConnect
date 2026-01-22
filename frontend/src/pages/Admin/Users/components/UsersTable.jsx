// src/pages/admin/users/UserTable.jsx
import React from "react";
import { Eye, EyeOff, Pencil, Ban, CheckCircle, Trash2 } from "lucide-react";

import { getRoleStyles } from "@/utils/roleStyles";
import { getInitials, getAvatarUrl } from "@/utils/avatarHelper";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersTable({
    users,
    currentUser,
    selectedUserId,
    setSelectedUserId,
    setSelectedUserForEdit,
    setIsEditModalOpen,
    setUserToDelete,
}) {
    const handleStatusChange = (userId, newStatus) => {
        if (window.confirm(`Change user status to ${newStatus}?`)) {
            // call mutation here or pass as prop if you want to keep mutation in parent
            console.warn("Status change not implemented in this split version");
            // updateStatusMutation.mutate({ id: userId, status: newStatus });
        }
    };

    return (
        <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center">
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <FilterX className="h-8 w-8 mb-2 opacity-30" />
                                    <p className="font-medium">
                                        No users found
                                    </p>
                                    <p className="text-xs mt-1">
                                        Try adjusting your filters
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow
                                key={user.id}
                                className="hover:bg-muted/30 transition-colors"
                            >
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    #{user.id}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage
                                                src={getAvatarUrl(user)}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="text-xs font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        className={`uppercase ${getRoleStyles(user.role)}`}
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    {user.role === "admin" ? (
                                        <Badge
                                            variant="outline"
                                            className="bg-purple-50/60 text-purple-700"
                                        >
                                            System
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.deleted_at
                                                    ? "line-through bg-gray-200"
                                                    : ""
                                            }
                                        >
                                            {user.deleted_at
                                                ? "Deleted"
                                                : user.status || "Active"}
                                        </Badge>
                                    )}
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                    {user.created_at
                                        ? new Date(
                                              user.created_at,
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                          })
                                        : "—"}
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() =>
                                                setSelectedUserId(
                                                    selectedUserId === user.id
                                                        ? null
                                                        : user.id,
                                                )
                                            }
                                        >
                                            {selectedUserId === user.id ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>

                                        {!user.deleted_at && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-blue-600"
                                                onClick={() => {
                                                    setSelectedUserForEdit(
                                                        user,
                                                    );
                                                    setIsEditModalOpen(true);
                                                }}
                                                disabled={
                                                    currentUser?.role !==
                                                    "admin"
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {!user.deleted_at &&
                                            user.role !== "admin" &&
                                            user.id !== currentUser?.id && (
                                                <>
                                                    {user.status !==
                                                    "suspended" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-orange-600"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    user.id,
                                                                    "suspended",
                                                                )
                                                            }
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-emerald-600"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    user.id,
                                                                    "active",
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}

                                        {!user.deleted_at &&
                                            currentUser?.id !== user.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600"
                                                    onClick={() =>
                                                        setUserToDelete(user)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
    );
}
