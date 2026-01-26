// src/pages/admin/ServicesManager.jsx
import React, { useState } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import { useServices } from "@/Hooks/useServices";
import ServiceStats from "./components/ServiceStats";
import ServiceTable from "./components/ServiceTable";
import ServiceForm from "./components/ServiceForm";

export default function ServiceManager() {
    const { data: services = [], isLoading: isLoadingServices } = useServices();
    const [editingId, setEditingId] = useState(null);

    if (isLoadingServices) return <div>Loading...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    Service Management
                </h1>
                <p className="text-muted-foreground mt-1 ml-12">
                    Manage cleaning packages, pricing, and custom icons.
                </p>
            </div>

            <ServiceStats services={services} />

            {/* --- LAYOUT FIX IS HERE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Table takes 8 columns */}
                <div className="lg:col-span-8">
                    <ServiceTable
                        services={services}
                        editingId={editingId}
                        setEditingId={setEditingId}
                    />
                </div>

                {/* Form takes 4 columns and is STICKY */}
                <div className="lg:col-span-4 sticky top-6">
                    <ServiceForm
                        editingId={editingId}
                        setEditingId={setEditingId}
                        services={services}
                    />
                </div>
            </div>
        </div>
    );
}
