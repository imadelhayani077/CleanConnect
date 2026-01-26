import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Save, X, UploadCloud, ImageIcon } from "lucide-react";

import { useCreateService, useUpdateService } from "@/Hooks/useServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// Simple schema (we handle file validation manually to keep it simple)
const formSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    base_price: z.coerce.number().min(1, "Price must be at least 1"),
    description: z.string().optional(),
});

export default function ServiceForm({ editingId, setEditingId, services }) {
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

    // UI States
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", base_price: "", description: "" },
    });

    // 1. Populate form when Editing
    useEffect(() => {
        if (editingId && services) {
            const service = services.find((s) => s.id === editingId);
            if (service) {
                form.reset({
                    name: service.name,
                    base_price: service.base_price,
                    description: service.description || "",
                });
                // If the service has an image, show it
                if (service.image_path) {
                    setPreviewUrl(`http://localhost:8000${service.image_path}`);
                } else {
                    setPreviewUrl(null);
                }
            }
        } else {
            handleReset();
        }
    }, [editingId, services, form]);

    // 2. Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Local preview
        }
    };

    // 3. Clear Image
    const handleRemoveImage = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop clicking the upload box
        setSelectedFile(null);
        setPreviewUrl(null);
        // Reset the file input value
        const fileInput = document.getElementById("icon-upload");
        if (fileInput) fileInput.value = "";
    };

    // 4. Reset Form
    const handleReset = () => {
        setEditingId(null);
        form.reset({ name: "", base_price: "", description: "" });
        setPreviewUrl(null);
        setSelectedFile(null);
    };

    // 5. Submit Logic (FormData)
    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("base_price", values.base_price);
        formData.append("description", values.description || "");

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        // Note: For Update, Laravel often needs _method: PUT inside FormData
        if (editingId) {
            formData.append("_method", "PUT");
            await updateMutation.mutateAsync({ id: editingId, data: formData });
            setEditingId(null);
        } else {
            await createMutation.mutateAsync(formData);
            handleReset();
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Card className="border-border/60 shadow-lg bg-card">
            <CardHeader className="pb-3 border-b border-border/40 mb-4 bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                    {editingId ? (
                        <Save className="w-4 h-4" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    {editingId ? "Edit Service" : "New Service"}
                </CardTitle>
                <CardDescription>
                    {editingId
                        ? "Update service details and icon."
                        : "Add a new cleaning package."}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* --- CUSTOM IMAGE UPLOAD AREA --- */}
                        <div className="space-y-2">
                            <FormLabel>Service Icon</FormLabel>

                            {/* Hidden standard Input */}
                            <input
                                type="file"
                                id="icon-upload"
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                onChange={handleFileChange}
                            />

                            {/* Custom styled box linked to the hidden input */}
                            <label
                                htmlFor="icon-upload"
                                className={`
                                    relative flex flex-col items-center justify-center w-full h-40
                                    border-2 border-dashed rounded-xl cursor-pointer transition-all
                                    hover:bg-muted/50
                                    ${previewUrl ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 bg-muted/5"}
                                `}
                            >
                                {previewUrl ? (
                                    <>
                                        {/* Image Preview */}
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-contain p-2 rounded-xl"
                                        />

                                        {/* Remove Button (X) */}
                                        <button
                                            onClick={handleRemoveImage}
                                            type="button"
                                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 shadow-md hover:bg-destructive/90 transition-colors"
                                            title="Remove image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    /* Empty State */
                                    <div className="flex flex-col items-center text-center p-4">
                                        <div className="p-3 bg-background rounded-full shadow-sm mb-3">
                                            <UploadCloud className="w-6 h-6 text-primary" />
                                        </div>
                                        <p className="text-sm font-medium">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG or SVG (Max 2MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <BriefcaseIconWrapper />
                                            <Input
                                                className="pl-9"
                                                placeholder="e.g. Deep Clean"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price Field */}
                        <FormField
                            control={form.control}
                            name="base_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Price ($)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                                                $
                                            </span>
                                            <Input
                                                type="number"
                                                className="pl-7"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="resize-none min-h-[80px]"
                                            placeholder="What is included in this service?"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : editingId ? (
                                    "Update"
                                ) : (
                                    "Create"
                                )}
                            </Button>

                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
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

// Helper component for style
function BriefcaseIconWrapper() {
    return (
        <div className="absolute left-3 top-2.5 text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
        </div>
    );
}
