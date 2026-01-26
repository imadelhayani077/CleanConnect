import React, { useState } from "react";
import { Plus, LayoutGrid, Loader2 } from "lucide-react";
import { useServices, useDeleteService } from "@/Hooks/useServices";

// Components
import ServiceStats from "./components/ServiceStats";
import ServiceCard from "./components/ServiceCard";
import ServiceFormModal from "./components/ServiceForm"; // The modal we just made
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/button";

export default function ServiceManager() {
    const { data: services = [], isLoading } = useServices();
    const deleteMutation = useDeleteService();

    // --- State Management ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    // --- Handlers ---

    // 1. Open Modal for Create
    const handleCreateClick = () => {
        setEditingService(null); // Clear data
        setIsFormOpen(true);
    };

    // 2. Open Modal for Edit
    const handleEditClick = (service) => {
        setEditingService(service); // Load data
        setIsFormOpen(true);
    };

    // 3. Handle Delete (Opens confirmation)
    const handleDeleteClick = (id) => {
        setDeleteModal({ open: true, id });
    };

    const confirmDelete = async () => {
        if (deleteModal.id) {
            await deleteMutation.mutateAsync(deleteModal.id);
            setDeleteModal({ open: false, id: null });
        }
    };

    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
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
                        Services
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-12">
                        Manage your cleaning catalog and prices.
                    </p>
                </div>

                {/* Main Action Button */}
                <Button
                    onClick={handleCreateClick}
                    size="lg"
                    className="shadow-lg hover:shadow-primary/25 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Service
                </Button>
            </div>

            {/* Statistics Section */}
            <ServiceStats services={services} />

            {/* --- CARDS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Render Service Cards */}
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                ))}

                {/* Empty State / "Add New" Placeholder Card (Optional, looks nice) */}
                <button
                    onClick={handleCreateClick}
                    className="group flex flex-col items-center justify-center h-full min-h-[300px] rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                    <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors shadow-sm">
                        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <p className="mt-4 font-medium text-muted-foreground group-hover:text-foreground">
                        Create New Service
                    </p>
                </button>
            </div>

            {/* --- MODALS --- */}

            {/* 1. Create / Edit Form Modal */}
            <ServiceFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                serviceToEdit={editingService}
            />

            {/* 2. Delete Confirmation */}
            <ConfirmationModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onConfirm={confirmDelete}
                title="Delete Service?"
                description="This action cannot be undone."
                variant="destructive"
                confirmText="Delete"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
