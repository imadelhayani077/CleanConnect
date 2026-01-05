import React, { useState } from "react";
import { useUsers } from "@/Hooks/useUsers";
import {
    Loader2,
    Search,
    ShieldAlert,
    User,
    Briefcase,
    FilterX,
    RefreshCcw,
    Eye, // Import Eye icon
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

// --- IMPORT THE MODAL ---
import UserDetailModal from "./components/UserDetailModal";

export default function UsersList() {
    // 1. Use the Custom Hook
    const { users, loading, error, refetch } = useUsers();

    // 2. Local UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // 3. Modal State
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Helper: Filter Logic
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id?.toString().includes(searchTerm);

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Helper: Get Initials
    const getInitials = (name) =>
        name
            ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
            : "U";

    // Helper: Role Badge
    const getRoleBadge = (role) => (
        <Badge
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getRoleStyles(
                role
            )}`}
        >
            {role}
        </Badge>
    );

    // Loading State
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

    // Error State
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
                    <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Data
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="client">Clients</SelectItem>
                                <SelectItem value="sweepstar">
                                    Sweepstars
                                </SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                            </SelectContent>
                        </Select>
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
                                    {/* Added Actions Column */}
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
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
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            {/* Action Button */}
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedUserId(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
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
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* --- RENDER MODAL --- */}
            {selectedUserId && (
                <UserDetailModal
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}
        </div>
    );
}
