import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Hooks
import { useAddress } from "@/Hooks/useAddress";

// UI Components
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Validation Schema ---
const addressSchema = z.object({
    street_address: z.string().min(5, "Address must be at least 5 characters."),
    city: z.string().min(2, "City name is too short."),
    postal_code: z.string().optional(),
});

export default function AddAddressForm({ onSuccess }) {
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
            // Optional: wait a moment before closing to show success message
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1000);
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
                    <Alert className="bg-green-50 text-green-800 border-green-200">
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
}
