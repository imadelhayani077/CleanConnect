import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Hooks
import { useAddress } from "@/Hooks/useAddress";

// Icons
import {
    MapPin,
    Plus,
    Trash2,
    Home,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Validation Schema ---
const addressSchema = z.object({
    street_address: z.string().min(5, "Address must be at least 5 characters."),
    city: z.string().min(2, "City name is too short."),
    postal_code: z.string().optional(),
});

// --- Sub-Component: Add Address Form ---
const AddAddressForm = ({ onSuccess }) => {
    const { addAddress, isAdding } = useAddress();

    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street_address: "",
            city: "",
            postal_code: "",
        },
    });

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const onSubmit = async (data) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            await addAddress(data);
            setSubmitSuccess("Address saved successfully.");
            form.reset();
            onSuccess(); // Close the dialog if desired
        } catch (error) {
            console.error(error);
            setSubmitError("Failed to save address. Please try again.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="street_address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="123 Hassan II Avenue"
                                        className="pl-9"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Casablanca"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postal_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="20000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {submitError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                {submitSuccess && (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{submitSuccess}</AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isAdding}>
                        {isAdding && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Address
                    </Button>
                </div>
            </form>
        </Form>
    );
};

// --- Main Component ---
export default function AddressManager() {
    const { addresses, loading, error, deleteAddress } = useAddress();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const handleDelete = async (id) => {
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
                        <Card
                            key={addr.id}
                            className="relative group hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary"
                        >
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2 text-primary font-semibold bg-primary/10 px-2 py-1 rounded text-xs uppercase tracking-wide">
                                        <Home className="w-3 h-3" />
                                        <span>Saved</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2 h-8 w-8 transition-colors"
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={deletingId === addr.id}
                                    >
                                        {deletingId === addr.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-semibold text-lg text-foreground line-clamp-1">
                                        {addr.street_address}
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        {addr.city}
                                        {addr.postal_code && (
                                            <span className="opacity-75">
                                                {" "}
                                                • {addr.postal_code}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
