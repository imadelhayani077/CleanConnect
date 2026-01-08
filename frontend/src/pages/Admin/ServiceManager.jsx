// src/pages/admin/ServiceManager.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Loader2,
    Trash2,
    Pencil,
    Briefcase,
    Plus,
    DollarSign,
    FileText,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import {
    useServices,
    useCreateService,
    useUpdateService,
    useDeleteService,
} from "@/Hooks/useServices";

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
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation Schema
const formSchema = z.object({
    name: z
        .string()
        .min(2, "Service name must be at least 2 characters")
        .max(100, "Service name must be less than 100 characters"),
    base_price: z.coerce.number().min(0.01, "Price must be at least $0.01"),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
});

export default function ServiceManager() {
    // Data & Mutations
    const { data: services = [], isLoading: isLoadingServices } = useServices();
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();
    const deleteMutation = useDeleteService();

    // Local State
    const [editingId, setEditingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    // Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            base_price: "",
            description: "",
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Statistics
    const stats = {
        total: services.length,
        avgPrice:
            services.length > 0
                ? (
                      services.reduce(
                          (sum, s) => sum + parseFloat(s.base_price || 0),
                          0
                      ) / services.length
                  ).toFixed(2)
                : 0,
    };

    // Handlers
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
                await updateMutation.mutateAsync({
                    id: editingId,
                    data: payload,
                });
            } else {
                await createMutation.mutateAsync(payload);
            }
            handleCancelEdit();
        } catch (error) {
            console.error("Service form submit failed:", error);
        }
    };

    const handleEditClick = (service) => {
        setEditingId(service.id);
        form.setValue("name", service.name ?? "");
        form.setValue("base_price", Number(service.base_price ?? 0));
        form.setValue("description", service.description ?? "");

        const el = document.getElementById("service-name-input");
        if (el) el.focus();
    };

    const handleDeleteClick = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            await deleteMutation.mutateAsync(id);
            if (editingId === id) {
                handleCancelEdit();
            }
            setDeleteError(null);
        } catch (error) {
            setDeleteError("Failed to delete service. Please try again.");
            console.error("Delete service failed:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        Service Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage cleaning packages and pricing for your platform
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Services
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Average Price
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    ${stats.avgPrice}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/20">
                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-12 items-start">
                {/* Services Table */}
                <Card className="md:col-span-7 lg:col-span-8 rounded-xl border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    Available Services
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {services.length} service
                                    {services.length !== 1 ? "s" : ""}{" "}
                                    configured
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/60 bg-muted/30 hover:bg-muted/30">
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
                                {isLoadingServices ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-48 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                                <p className="text-muted-foreground">
                                                    Loading services...
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : services.length === 0 ? (
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
                                                    Create one using the form on
                                                    the right
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
                                                {service.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm max-w-[220px] truncate">
                                                {service.description || "—"}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-foreground">
                                                $
                                                {parseFloat(
                                                    service.base_price
                                                ).toFixed(2)}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 dark:hover:bg-blue-900/20"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                service
                                                            )
                                                        }
                                                        title="Edit service"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                service.id
                                                            )
                                                        }
                                                        title="Delete service"
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

                {/* Form Card */}
                <Card
                    className={`md:col-span-5 lg:col-span-4 rounded-xl border-border/60 bg-background/50 backdrop-blur-sm transition-all duration-300 ${
                        editingId
                            ? "ring-2 ring-primary/50 shadow-lg"
                            : "shadow-md"
                    }`}
                >
                    <CardHeader className="border-b border-border/60 pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            {editingId ? (
                                <>
                                    <Pencil className="w-5 h-5 text-blue-600" />
                                    Edit Service
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5 text-primary" />
                                    Add New Service
                                </>
                            )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            {editingId
                                ? "Update service details and pricing below"
                                : "Create a new service offering for clients"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {deleteError && (
                            <Alert className="mb-4 border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                                    {deleteError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                {/* Service Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold">
                                                Service Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="service-name-input"
                                                        placeholder="e.g. Deep Cleaning"
                                                        disabled={isSubmitting}
                                                        className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Base Price */}
                                <FormField
                                    control={form.control}
                                    name="base_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold">
                                                Base Price ($)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        disabled={isSubmitting}
                                                        className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold">
                                                Description (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="What does this service include?"
                                                        disabled={isSubmitting}
                                                        className="pl-10 rounded-lg bg-muted/40 border-border/60 focus:border-primary/50"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-lg font-semibold gap-2 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
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
                                            onClick={handleCancelEdit}
                                            disabled={isSubmitting}
                                            className="rounded-lg border-border/60 hover:bg-muted/50"
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
