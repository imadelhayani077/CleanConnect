// src/components/address/AddAddressForm.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    MapPin,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Home,
    Pencil,
} from "lucide-react";

import { useAddress } from "@/Hooks/useAddress";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

// Validation Schema
const addressSchema = z.object({
    street_address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City name is too short"),
    postal_code: z.string().optional(),
});

export default function AddAddressForm({ onSuccess, addressToEdit }) {
    // 1. Destructure update functions from the hook
    const { addAddress, updateAddress, isAdding, isUpdating } = useAddress();

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street_address: "",
            city: "",
            postal_code: "",
        },
    });

    // 2. Effect: Populate the form if we are editing
    useEffect(() => {
        if (addressToEdit) {
            form.reset({
                street_address: addressToEdit.street_address,
                city: addressToEdit.city,
                postal_code: addressToEdit.postal_code || "",
            });
        } else {
            form.reset({
                street_address: "",
                city: "",
                postal_code: "",
            });
        }
    }, [addressToEdit, form]);

    const onSubmit = async (data) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            if (addressToEdit) {
                // 3. EDIT MODE logic
                await updateAddress({ id: addressToEdit.id, data });
                setSubmitSuccess("Address updated successfully!");
            } else {
                // 4. CREATE MODE logic
                await addAddress(data);
                setSubmitSuccess("Address saved successfully!");
            }

            // Only reset if it's a new address, otherwise keep values for user to see
            if (!addressToEdit) {
                form.reset();
            }

            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (error) {
            console.error(error);
            setSubmitError(
                error.response?.data?.message ||
                    "Failed to save address. Please try again.",
            );
        }
    };

    // Calculate loading state
    const isLoading = isAdding || isUpdating;

    return (
        <Card className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-sm shadow-none border-0">
            <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        {/* Dynamic Icon */}
                        {addressToEdit ? (
                            <Pencil className="w-5 h-5 text-primary" />
                        ) : (
                            <Home className="w-5 h-5 text-primary" />
                        )}
                    </div>
                    <div>
                        <CardTitle className="text-lg">
                            {/* Dynamic Title */}
                            {addressToEdit ? "Edit Address" : "Add New Address"}
                        </CardTitle>
                        <CardDescription className="mt-0.5">
                            {/* Dynamic Description */}
                            {addressToEdit
                                ? "Update your existing location details"
                                : "Save a new delivery or service address"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Street Address */}
                        <FormField
                            control={form.control}
                            name="street_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-foreground">
                                        Street Address
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="123 Hassan II Avenue"
                                                className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50 h-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* City & Postal Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            City
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Casablanca"
                                                className="rounded-lg bg-muted/40 border-border/60 focus:border-primary/50 h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="postal_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Postal Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="20000"
                                                className="rounded-lg bg-muted/40 border-border/60 focus:border-primary/50 h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Error Alert */}
                        {submitError && (
                            <Alert className="border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Success Alert */}
                        {submitSuccess && (
                            <Alert className="border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800/60 rounded-lg">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <AlertDescription className="text-emerald-800 dark:text-emerald-300 text-sm">
                                    {submitSuccess}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg h-10 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200 group gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {addressToEdit
                                        ? "Updating..."
                                        : "Saving Address..."}
                                </>
                            ) : (
                                <>
                                    {addressToEdit ? (
                                        <Pencil className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    ) : (
                                        <MapPin className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    )}
                                    {addressToEdit
                                        ? "Update Address"
                                        : "Save Address"}
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
