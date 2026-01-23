// src/pages/admin/ServiceForm.jsx
import React, { useEffect } from "react"; // [!code focus] Import useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Pencil,
    Plus,
    Loader2,
    CheckCircle2,
    Briefcase,
    DollarSign,
    FileText,
} from "lucide-react";

import { useCreateService, useUpdateService } from "@/Hooks/useServices";

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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
    name: z.string().min(2).max(100),
    base_price: z.coerce.number().min(0.01),
    description: z.string().max(500).optional(),
});

// [!code focus] 1. Make sure to accept 'services' as a prop
export default function ServiceForm({ editingId, setEditingId, services }) {
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", base_price: "", description: "" },
    });

    // [!code focus] 2. Add this useEffect to listen for changes
    useEffect(() => {
        if (editingId && services) {
            // Find the service that matches the ID
            const serviceToEdit = services.find((s) => s.id === editingId);

            if (serviceToEdit) {
                // Populate the form with that service's data
                form.reset({
                    name: serviceToEdit.name,
                    base_price: serviceToEdit.base_price,
                    description: serviceToEdit.description || "",
                });
            }
        } else {
            // If not editing (or ID is cleared), clear the form
            form.reset({
                name: "",
                base_price: "",
                description: "",
            });
        }
    }, [editingId, services, form]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const onSubmit = async (values) => {
        try {
            if (editingId) {
                await updateMutation.mutateAsync({
                    id: editingId,
                    data: values,
                });
                setEditingId(null); // Clear edit mode after success
            } else {
                await createMutation.mutateAsync(values);
                // Form clears automatically via the useEffect when editingId remains null
                form.reset();
            }
        } catch (error) {
            console.error("Failed to save service", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        form.reset({ name: "", base_price: "", description: "" });
    };

    return (
        <Card className="md:col-span-5 lg:col-span-4 rounded-xl border-border/60 bg-background/50 backdrop-blur-sm h-fit sticky top-6">
            <CardHeader className="border-b border-border/60 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    {editingId ? (
                        <>
                            <Pencil className="w-5 h-5 text-primary" />
                            Edit Service
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5 text-primary" />
                            New Service
                        </>
                    )}
                </CardTitle>
                <CardDescription>
                    {editingId
                        ? "Update service details and pricing"
                        : "Add a new cleaning package to the platform"}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                                        Service Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Deep Clean"
                                            className="bg-muted/30"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="base_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                                        Base Price ($)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="bg-muted/30 font-mono"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="What's included?"
                                            className="bg-muted/30"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : editingId ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Update Service
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Add Service
                                    </>
                                )}
                            </Button>

                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
