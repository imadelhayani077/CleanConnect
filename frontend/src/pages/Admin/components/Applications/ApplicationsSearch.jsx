// src/components/applications/ApplicationSearch.jsx
import React from "react";
import { Search } from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ApplicationSearch({ searchTerm, setSearchTerm }) {
    return (
        <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/60 pb-4">
                <CardTitle className="text-lg">Search & Filter</CardTitle>
                <CardDescription>
                    Find applicants by name or email
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
