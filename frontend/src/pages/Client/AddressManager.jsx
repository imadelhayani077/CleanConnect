import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Icons
import { MapPin, Plus, Trash2, Home, Loader2 } from "lucide-react";

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
import { useAddress } from "@/Helper/AddressContext";

// 1. Define Validation Schema (Zod)
const addressSchema = z.object({
    street_address: z
        .string()
        .min(5, "Street address must be at least 5 characters."),
    city: z.string().min(2, "City name is too short."),
    postal_code: z.string().optional(),
});

export default function AddressManager() {
    const { addresses, loading, addAddress, deleteAddress } = useAddress();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // --- SUB-COMPONENT: The Add Address Form ---
    const AddAddressForm = () => {
        const form = useForm({
            resolver: zodResolver(addressSchema),
            defaultValues: {
                street_address: "",
                city: "",
                postal_code: "",
            },
        });

        const onSubmit = async (data) => {
            const result = await addAddress(data);
            if (result.success) {
                setIsDialogOpen(false); // Close modal on success
                form.reset();
            } else {
                // You could set a form error here if the backend fails
                console.error("Backend error");
            }
        };

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Street Address Field */}
                    <FormField
                        control={form.control}
                        name="street_address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="123 Hassan II Avenue"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        {/* City Field */}
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

                        {/* Postal Code Field */}
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

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Address
                        </Button>
                    </div>
                </form>
            </Form>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Section */}
            <div className="flex justify-between items-center border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        My Addresses
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your saved locations for easier bookings.
                    </p>
                </div>

                {/* ADD NEW BUTTON (Triggers Dialog) */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>
                                Enter the details of your location here. Click
                                save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        {/* Render the form inside the modal */}
                        <AddAddressForm />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Address List Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full flex justify-center py-10 text-muted-foreground">
                        <Loader2 className="animate-spin mr-2" /> Loading
                        addresses...
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                        <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">
                            No addresses found
                        </h3>
                        <p className="text-muted-foreground">
                            Add your first address to start booking services.
                        </p>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <Card
                            key={addr.id}
                            className="relative group hover:shadow-md transition-all"
                        >
                            <CardContent className="p-6 flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                                        <Home className="w-4 h-4" />
                                        <span>Home</span>
                                    </div>
                                    <p className="font-medium text-foreground">
                                        {addr.street_address}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {addr.city}{" "}
                                        {addr.postal_code &&
                                            `, ${addr.postal_code}`}
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                                    onClick={() => deleteAddress(addr.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
