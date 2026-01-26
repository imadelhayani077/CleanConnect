// src/pages/admin/ServiceTable.jsx
import React, { useState } from "react";
import { Pencil, Trash2, Briefcase } from "lucide-react";

import { useDeleteService } from "@/Hooks/useServices";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function ServiceTable({ services, editingId, setEditingId }) {
    const deleteMutation = useDeleteService();

    // State for the delete confirmation modal
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        id: null,
    });

    const handleEditClick = (service) => {
        setEditingId(service.id);
    };

    // Open the modal instead of window.confirm
    const handleDeleteClick = (id) => {
        setDeleteModal({
            open: true,
            id: id,
        });
    };

    // The actual deletion logic called by the modal
    const handleConfirmDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;

        try {
            await deleteMutation.mutateAsync(id);
            // If we deleted the item currently being edited, close the edit form
            if (editingId === id) setEditingId(null);

            // Close modal on success
            setDeleteModal({ open: false, id: null });
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return (
        <>
            <Card className="md:col-span-7 lg:col-span-8 rounded-xl border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden h-fit sticky top-6">
                <CardHeader className="border-b border-border/60 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                Available Services
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {services.length} service
                                {services.length !== 1 ? "s" : ""} configured
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border/60 bg-muted/30">
                                <TableHead className="w-[80px] font-semibold text-xs uppercase text-muted-foreground">
                                    ID
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Service Name
                                </TableHead>
                                <TableHead className="max-w-[220px] font-semibold">
                                    Description
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    Base Price
                                </TableHead>
                                <TableHead className="text-right w-[100px] font-semibold">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {services.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-48 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                            <p className="text-muted-foreground font-medium">
                                                No services yet
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Create one using the form on the
                                                right
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow
                                        key={service.id}
                                        className={`border-b border-border/40 transition-all ${
                                            editingId === service.id
                                                ? "bg-primary/5 border-l-2 border-l-primary"
                                                : "hover:bg-muted/20"
                                        }`}
                                    >
                                        <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                                            #{service.id}
                                        </TableCell>
                                        <TableCell className="font-semibold text-foreground">
                                            {/* --- UPDATED: Image Display --- */}
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                                                    {service.image_path ? (
                                                        <img
                                                            // Ensure this matches your Laravel URL structure
                                                            src={`http://localhost:8000${service.image_path}`}
                                                            alt={service.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <span>{service.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm max-w-[220px] truncate">
                                            {service.description || "—"}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-foreground">
                                            $
                                            {Number(service.base_price).toFixed(
                                                2,
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50/60"
                                                    onClick={() =>
                                                        handleEditClick(service)
                                                    }
                                                    title="Edit service"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            service.id,
                                                        )
                                                    }
                                                    title="Delete service"
                                                    disabled={
                                                        deleteMutation.isPending
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Render the Confirmation Modal */}
            <ConfirmationModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onConfirm={handleConfirmDelete}
                title="Delete Service?"
                description="Are you sure you want to delete this service? This action cannot be undone."
                variant="destructive"
                confirmText="Delete"
                isLoading={deleteMutation.isPending}
            />
        </>
    );
}
