import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientContext } from "@/Helper/ClientContext";
import React from "react";

export default function UserInfo() {
    const { user } = useClientContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Personnel information</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="min-w-full border border-border rounded-lg">
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

                    <tbody className="divide-border">
                        <tr className="hover:bg-muted/50 transition-colors">
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
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>

        // <div className="max-w-6xl mx-auto mt-10 p-6 bg-card rounded-lg shadow border border-border">
        //     <div className="overflow-x-auto"></div>
        // </div>
    );
}
