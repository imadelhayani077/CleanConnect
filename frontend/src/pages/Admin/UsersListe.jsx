import AdminApi from "@/Services/AdminApi";
import React, { useEffect, useState } from "react";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await AdminApi.getAllUsers();
                setUsers(data.users || data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            // Changed: bg-background ensures correct base color
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-full max-w-lg space-y-4">
                    {/* Replaced custom skeleton classes with standard Tailwind utilities for simplicity,
                        or use your own classes if they support dark mode. */}
                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        // Changed: bg-white -> bg-card, text-gray-800 -> text-card-foreground
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-card rounded-lg shadow border border-border">
            <h1 className="text-2xl font-bold mb-6 text-card-foreground">
                User Management
            </h1>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    {/* Changed: bg-gray-50 -> bg-muted/50, text-gray-600 -> text-muted-foreground, border-gray-200 -> border-border */}
                    <thead className="uppercase tracking-wider border-b border-border bg-muted/50 text-muted-foreground">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Joined Date
                            </th>
                        </tr>
                    </thead>
                    {/* Changed: divide-y -> divide-border */}
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                // Changed: hover:bg-gray-50 -> hover:bg-muted/50 (or hover:bg-accent)
                                className="hover:bg-muted/50 transition-colors"
                            >
                                {/* Changed: text-gray-900 -> text-foreground */}
                                <td className="px-6 py-4 font-medium text-foreground">
                                    #{user.id}
                                </td>
                                <td className="px-6 py-4 text-foreground">
                                    {user.name}
                                </td>
                                {/* Changed: text-blue-600 -> text-primary (keeps it readable in both modes) */}
                                <td className="px-6 py-4 text-primary font-medium">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            // Badges: Using semantic colors with opacity to look good on dark/light
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
                                {/* Changed: text-gray-500 -> text-muted-foreground */}
                                <td className="px-6 py-4 text-muted-foreground">
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
