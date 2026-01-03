// src/layout/NavBar/component/UserInfo.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useUser } from "@/Hooks/useAuth";

export default function UserInfo() {
    const { data: user, isLoading } = useUser();

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-10 flex justify-center">
                    <Loader className="animate-spin h-8 w-8 text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (!user) return null;

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>My Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <table className="min-w-full">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold tracking-wider border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">
                                    Joined Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            <tr className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">
                                    #{user.id}
                                </td>
                                <td className="px-6 py-4 text-foreground">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-primary font-medium">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            user.role === "admin"
                                                ? "bg-red-500/15 text-red-600 dark:text-red-400"
                                                : user.role === "sweepstar"
                                                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                                : "bg-green-500/15 text-green-600 dark:text-green-400"
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {user.created_at
                                        ? new Date(
                                              user.created_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
