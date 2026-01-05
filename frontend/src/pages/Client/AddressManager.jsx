import React, { useState } from "react";
import { Loader2, AlertCircle, Plus, MapPin } from "lucide-react";

// Hooks
import { useAddress } from "@/Hooks/useAddress";

// UI Components
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddressCard from "./components/AddressCard";
import AddAddressForm from "./components/AddAddressForm";

export default function AddressManager() {
    const { addresses, loading, error, deleteAddress } = useAddress();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?"))
            return;

        setDeletingId(id);
        setDeleteError(null);

        try {
            await deleteAddress(id);
        } catch (err) {
            console.error(err);
            setDeleteError("Could not delete address.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        My Addresses
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your saved locations.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0">
                            <Plus className="mr-2 h-4 w-4" /> Add New Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>
                                Enter your location details below.
                            </DialogDescription>
                        </DialogHeader>
                        <AddAddressForm
                            onSuccess={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Global Delete Error */}
            {deleteError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
            )}

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <Loader2 className="h-10 w-10 animate-spin mb-3 text-primary" />
                        <p>Loading your addresses...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-red-500">
                        <AlertCircle className="h-10 w-10 mb-2" />
                        <p>Failed to load addresses.</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            No addresses found
                        </h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-sm">
                            You haven't added any locations yet.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Add Your First Address
                        </Button>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <AddressCard
                            key={addr.id}
                            address={addr}
                            onDelete={handleDelete}
                            isDeleting={deletingId === addr.id}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
