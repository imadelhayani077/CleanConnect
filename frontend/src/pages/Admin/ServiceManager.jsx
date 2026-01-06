import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2, Pencil, Briefcase } from "lucide-react";

import {
    useServices,
    useCreateService,
    useUpdateService,
    useDeleteService,
} from "@/Hooks/useServices"; // adjust path if needed [file:36]

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Schema for the service form
const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Service name must be at least 2 characters." }),
    base_price: z.coerce
        .number()
        .min(1, { message: "Price must be at least 1." }),
    description: z.string().optional(),
});

export default function ServiceManager() {
    // 1. Data (React Query)
    const { data: services = [], isLoading: isLoadingServices } = useServices(); // [file:36]

    const createMutation = useCreateService(); // [file:36]
    const updateMutation = useUpdateService(); // [file:36]
    const deleteMutation = useDeleteService(); // [file:36]

    // 2. Local state for editing
    const [editingId, setEditingId] = useState(null);

    // 3. Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            base_price: "",
            description: "",
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Helpers
    const handleCancelEdit = () => {
        setEditingId(null);
        form.reset({
            name: "",
            base_price: "",
            description: "",
        });
    };

    const onSubmit = async (values) => {
        const payload = {
            name: values.name,
            base_price: values.base_price,
            description: values.description,
        };

        try {
            if (editingId) {
                // Update
                await updateMutation.mutateAsync({
                    id: editingId,
                    data: payload,
                });
            } else {
                // Create
                await createMutation.mutateAsync(payload);
            }

            handleCancelEdit();
        } catch (error) {
            // Errors are logged in hooks; you can add toasts here if you want
            console.error("Service form submit failed:", error);
        }
    };

    const handleEditClick = (service) => {
        setEditingId(service.id);
        form.setValue("name", service.name ?? "");
        form.setValue("base_price", Number(service.base_price ?? 0));
        form.setValue("description", service.description ?? "");

        // optional: focus the name input
        const el = document.getElementById("service-name-input");
        if (el) el.focus();
    };

    const handleDeleteClick = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service? This cannot be undone."
        );
        if (!confirmed) return;

        try {
            await deleteMutation.mutateAsync(id);
            if (editingId === id) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error("Delete service failed:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
            {/* Page header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Service Management
                </h2>
                <p className="text-muted-foreground">
                    Configure the cleaning packages available to your clients.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-12 items-start">
                {/* LEFT: Services table */}
                <Card className="md:col-span-7 lg:col-span-8 overflow-hidden bg-card border border-border">
                    <CardHeader className="bg-muted/40 pb-4 border-b border-border">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Available Services
                        </CardTitle>
                        <CardDescription>
                            View, edit, or remove the services offered in your
                            platform.
                        </CardDescription>
                    </CardHeader>

                    <div className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-muted/40">
                                    <TableHead className="w-[80px] text-xs uppercase text-muted-foreground">
                                        Ref ID
                                    </TableHead>
                                    <TableHead>Service Name</TableHead>
                                    <TableHead className="max-w-[220px]">
                                        Description
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Base Price
                                    </TableHead>
                                    <TableHead className="text-right w-[110px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoadingServices ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                                            Loading services...
                                        </TableCell>
                                    </TableRow>
                                ) : services.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No services configured yet. Use the
                                            form on the right to add one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service) => (
                                        <TableRow
                                            key={service.id}
                                            className={
                                                editingId === service.id
                                                    ? "bg-muted/40 border-l-2 border-l-primary"
                                                    : "hover:bg-muted/30"
                                            }
                                        >
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                #{service.id}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                {service.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs max-w-[220px] truncate">
                                                {service.description || "—"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {parseFloat(
                                                    service.base_price
                                                ).toFixed(2)}
                                            </TableCell>

                                            {/* Actions cell – ALWAYS visible */}
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-blue-600"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                service
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-red-600"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                service.id
                                                            )
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

                {/* RIGHT: Create / Edit form */}
                <Card
                    className={`md:col-span-5 lg:col-span-4 shadow-md bg-card border border-border transition-all duration-300 ${
                        editingId
                            ? "ring-2 ring-primary border-transparent"
                            : ""
                    }`}
                >
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {editingId ? "Edit Service" : "Add New Service"}
                        </CardTitle>
                        <CardDescription>
                            {editingId
                                ? "Update the pricing or details below."
                                : "Create a new service offering for your clients."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
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
                                            <FormLabel>Service Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="service-name-input"
                                                    placeholder="e.g. Deep Cleaning"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="base_price"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2 md:col-span-1">
                                                <FormLabel>
                                                    Base Price
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        disabled={isSubmitting}
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
                                            <FormItem className="col-span-2">
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Optional short description"
                                                        disabled={isSubmitting}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : editingId ? (
                                            "Update Service"
                                        ) : (
                                            "Add Service"
                                        )}
                                    </Button>

                                    {editingId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancelEdit}
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
            </div>
        </div>
    );
}
