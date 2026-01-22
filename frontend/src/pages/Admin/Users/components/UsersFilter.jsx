// src/pages/admin/users/UserFilters.jsx
import React from "react";
import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function UsersFilter({
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
}) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email or ID..."
                    className="pl-10 bg-muted/40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-muted/40">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="client">Clients</SelectItem>
                    <SelectItem value="sweepstar">Sweepstars</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                }}
                title="Clear filters"
            >
                <FilterX className="h-4 w-4" />
            </Button>
        </div>
    );
}
