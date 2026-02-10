import React, { useState } from "react";
import { Plus, LayoutGrid, Loader2 } from "lucide-react";
import { useServices, useDeleteService } from "@/Hooks/useServices";

// Components
import ServiceStats from "./components/ServiceStats";
import ServiceCard from "./components/ServiceCard";
import ServiceDetailsModal from "./components/ServiceDetailsModal"; // New
import ServiceUpdateModal from "./components/ServiceUpdateModal"; // New (Locked fields)
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/button";

export default function ServiceManager() {
    const { data: services = [], isLoading } = useServices();
    const deleteMutation = useDeleteService();

    // --- State Management ---
    const [selectedService, setSelectedService] = useState(null);
    const [modalState, setModalState] = useState({
        details: false,
        update: false,
        delete: false,
    });

    // --- Handlers ---

    // 1. Open Details (The Eye Button)
    const handleDetailsClick = (service) => {
        setSelectedService(service);
        setModalState((prev) => ({ ...prev, details: true }));
    };

    // 2. Open Update Modal (The Edit Button)
    const handleEditClick = (service) => {
        setSelectedService(service);
        setModalState((prev) => ({ ...prev, update: true }));
    };

    // 3. Handle Delete
    const handleDeleteClick = (id) => {
        setSelectedService({ id }); // We just need the ID for delete
        setModalState((prev) => ({ ...prev, delete: true }));
    };

    const confirmDelete = async () => {
        if (selectedService?.id) {
            await deleteMutation.mutateAsync(selectedService.id);
            setModalState((prev) => ({ ...prev, delete: false }));
            setSelectedService(null);
        }
    };

    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" />
            </div>
        );

    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <LayoutGrid className="w-6 h-6 text-primary" />
                        </div>
                        Services Management
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-12">
                        View details and update pricing configuration.
                    </p>
                </div>
            </div>

            <ServiceStats services={services} />

            {/* --- CARDS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onDetails={handleDetailsClick} // Pass the details handler
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {/* --- MODALS --- */}

            {/* 1. Read-Only Details Modal */}
            <ServiceDetailsModal
                isOpen={modalState.details}
                onClose={() => setModalState({ ...modalState, details: false })}
                service={selectedService}
            />

            {/* 2. Restricted Update Modal (Icon + Price + Duration only) */}
            <ServiceUpdateModal
                isOpen={modalState.update}
                onClose={() => setModalState({ ...modalState, update: false })}
                service={selectedService}
            />

            {/* 3. Delete Confirmation */}
            <ConfirmationModal
                open={modalState.delete}
                onClose={() => setModalState({ ...modalState, delete: false })}
                onConfirm={confirmDelete}
                title="Delete Service?"
                description="This will permanently remove the service and all its pricing options."
                variant="destructive"
                confirmText="Delete"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
