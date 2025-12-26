import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientContext } from "@/Helper/ClientContext";
import React from "react";

export default function ClientDashboard() {
    const { user } = useClientContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Client information</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted text-muted-foreground text-sm uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">#id</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Joined</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border text-sm">
                        <tr className="hover:bg-muted/50">
                            <td className="px-4 py-3">
                                <span className="font-medium">{user.id}</span>
                            </td>

                            <td className="px-4 py-3 flex items-center gap-2">
                                <img
                                    src="https://i.pravatar.cc/50"
                                    className="w-10 h-10 rounded-full"
                                    alt="User avatar"
                                />
                                {user.name}
                            </td>

                            <td className="px-4 py-3">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                                    {user.email}
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                                    Active
                                </span>
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                                {user.created_at}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
