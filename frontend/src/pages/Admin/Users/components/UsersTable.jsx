// src/pages/admin/users/UserTable.jsx
import React, { useState } from "react";
import {
    Eye,
    EyeOff,
    Pencil,
    Ban,
    CheckCircle,
    Trash2,
    FilterX,
} from "lucide-react";

import { getRoleStyles } from "@/utils/roleStyles";
import { getInitials, getAvatarUrl } from "@/utils/avatarHelper";

// 1. Import the hook from your uploaded file
import { useAdminUpdateStatus } from "@/Hooks/useUsers";

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
// 2. Import the Modal component you uploaded
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function UsersTable({
    users,
    currentUser,
    selectedUserId,
    setSelectedUserId,
    setSelectedUserForEdit,
    setIsEditModalOpen,
    setUserToDelete,
}) {
    // 3. Use the mutation hook
    const statusMutation = useAdminUpdateStatus();

    // 4. Local state for the status confirmation modal
    const [statusModal, setStatusModal] = useState({
        open: false,
        userId: null,
        newStatus: null, // 'active' or 'suspended'
        userName: "",
    });

    // Open the modal when button is clicked
    const handleStatusClick = (user, newStatus) => {
        setStatusModal({
            open: true,
            userId: user.id,
            newStatus: newStatus,
            userName: user.name,
        });
    };

    // Execute the mutation when "Confirm" is clicked in the modal
    const onConfirmStatusChange = async () => {
        if (!statusModal.userId) return;

        try {
            await statusMutation.mutateAsync({
                id: statusModal.userId,
                status: statusModal.newStatus,
            });
            // Close modal on success
            setStatusModal((prev) => ({ ...prev, open: false }));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <>
            <div className="rounded-lg border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-32 text-center"
                                >
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
                                    <TableCell
                                        className="font-mono text-xs text-muted-foreground"
                                        onClick={() =>
                                            setSelectedUserId(user.id)
                                        }
                                    >
                                        #{user.id}
                                    </TableCell>

                                    <TableCell
                                        onClick={() =>
                                            setSelectedUserId(user.id)
                                        }
                                    >
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

                                    <TableCell
                                        onClick={() =>
                                            setSelectedUserId(user.id)
                                        }
                                    >
                                        <Badge
                                            className={`uppercase ${getRoleStyles(user.role)}`}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>

                                    <TableCell
                                        onClick={() =>
                                            setSelectedUserId(user.id)
                                        }
                                    >
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
                                                        : user.status ===
                                                            "suspended"
                                                          ? "bg-red-100 text-red-700 border-red-200"
                                                          : "bg-green-100 text-green-700 border-green-200"
                                                }
                                            >
                                                {user.deleted_at
                                                    ? "Deleted"
                                                    : user.status || "Active"}
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell
                                        className="text-sm text-muted-foreground"
                                        onClick={() =>
                                            setSelectedUserId(user.id)
                                        }
                                    >
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
                                                        selectedUserId ===
                                                            user.id
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
                                                        setIsEditModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    disabled={
                                                        currentUser?.role !==
                                                        "admin"
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {/* --- STATUS ACTION BUTTONS --- */}
                                            {!user.deleted_at &&
                                                user.role !== "admin" &&
                                                user.id !== currentUser?.id && (
                                                    <>
                                                        {user.status !==
                                                        "suspended" ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50"
                                                                onClick={() =>
                                                                    handleStatusClick(
                                                                        user,
                                                                        "suspended",
                                                                    )
                                                                }
                                                                title="Suspend User"
                                                            >
                                                                <Ban className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50"
                                                                onClick={() =>
                                                                    handleStatusClick(
                                                                        user,
                                                                        "active",
                                                                    )
                                                                }
                                                                title="Activate User"
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
                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                        onClick={() =>
                                                            setUserToDelete(
                                                                user,
                                                            )
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

            {/* --- CONFIRMATION MODAL FOR STATUS CHANGE --- */}
            <ConfirmationModal
                open={statusModal.open}
                onClose={() =>
                    setStatusModal((prev) => ({ ...prev, open: false }))
                }
                onConfirm={onConfirmStatusChange}
                isLoading={statusMutation.isPending}
                title={
                    statusModal.newStatus === "suspended"
                        ? "Suspend User?"
                        : "Activate User?"
                }
                description={
                    statusModal.newStatus === "suspended"
                        ? `Are you sure you want to suspend ${statusModal.userName}? They will not be able to log in.`
                        : `Are you sure you want to activate ${statusModal.userName}? They will regain access to the platform.`
                }
                variant={
                    statusModal.newStatus === "suspended"
                        ? "destructive"
                        : "default"
                }
                confirmText={
                    statusModal.newStatus === "suspended"
                        ? "Suspend Account"
                        : "Activate Account"
                }
            />
        </>
    );
}
