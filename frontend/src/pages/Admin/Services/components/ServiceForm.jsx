// src/pages/admin/ServiceForm.jsx
import React from "react";
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

export default function ServiceForm({ editingId, setEditingId }) {
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", base_price: "", description: "" },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    React.useEffect(() => {
        if (!editingId) {
            form.reset({ name: "", base_price: "", description: "" });
        }
    }, [editingId, form]);

    const onSubmit = async (values) => {
        const payload = {
            name: values.name,
            base_price: values.base_price,
            description: values.description || undefined,
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
            setEditingId(null);
        } catch (err) {
            console.error("Service save failed:", err);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    return (
        <Card
            className={`md:col-span-5 lg:col-span-4 rounded-xl border-border/60 bg-background/50 backdrop-blur-sm transition-all duration-300 ${
                editingId ? "ring-2 ring-primary/50 shadow-lg" : "shadow-md"
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
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
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
                                                placeholder="e.g. Deep Cleaning"
                                                disabled={isSubmitting}
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

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
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

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
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
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
