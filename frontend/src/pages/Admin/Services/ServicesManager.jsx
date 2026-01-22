// src/pages/admin/ServiceManager.jsx
import React, { useState } from "react";
import { Briefcase, Loader2, AlertCircle } from "lucide-react";

import { useServices } from "@/Hooks/useServices";
import ServiceStats from "./components/ServiceStats";
import ServiceTable from "./components/ServiceTable";
import ServiceForm from "./components/ServiceForm";

export default function ServiceManager() {
    const { data: services = [], isLoading: isLoadingServices } = useServices();

    const [editingId, setEditingId] = useState(null);

    if (isLoadingServices) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">
                        Loading services...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        Service Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage cleaning packages and pricing for your platform
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <ServiceStats services={services} />

            {/* Main content: Table + Form side by side */}
            <div className="grid gap-6 md:grid-cols-12 items-start">
                <ServiceTable
                    services={services}
                    editingId={editingId}
                    setEditingId={setEditingId}
                />

                <ServiceForm
                    editingId={editingId}
                    setEditingId={setEditingId}
                    services={services} // optional – only if you need it for something
                />
            </div>
        </div>
    );
}
