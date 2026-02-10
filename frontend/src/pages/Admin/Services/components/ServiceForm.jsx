import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X, UploadCloud, ImageIcon, Plus } from "lucide-react";

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const formSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    base_price: z.coerce.number().min(1, "Price must be at least 1"),
    description: z.string().optional(),
});

export default function ServiceFormModal({ isOpen, onClose, serviceToEdit }) {
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", base_price: "", description: "" },
    });

    // Reset form when modal opens or serviceToEdit changes
    useEffect(() => {
        if (isOpen) {
            if (serviceToEdit) {
                // EDIT MODE
                form.reset({
                    name: serviceToEdit.name,
                    base_price: serviceToEdit.base_price,
                    description: serviceToEdit.description || "",
                });
                if (serviceToEdit.image_path) {
                    setPreviewUrl(
                        `http://localhost:8000${serviceToEdit.image_path}`,
                    );
                } else {
                    setPreviewUrl(null);
                }
            } else {
                // CREATE MODE
                form.reset({ name: "", base_price: "", description: "" });
                setPreviewUrl(null);
                setSelectedFile(null);
            }
        }
    }, [isOpen, serviceToEdit, form]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("base_price", values.base_price);
        formData.append("description", values.description || "");

        if (selectedFile) {
            formData.append("service_icon", selectedFile);
        }

        try {
            if (serviceToEdit) {
                // Laravel PUT with FormData fix
                formData.append("_method", "PUT");
                await updateMutation.mutateAsync({
                    id: serviceToEdit.id,
                    data: formData,
                });
            } else {
                await createMutation.mutateAsync(formData);
            }

            onClose(); // Close modal on success
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {serviceToEdit ? (
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Save className="w-5 h-5 text-primary" />
                            </div>
                        ) : (
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Plus className="w-5 h-5 text-primary" />
                            </div>
                        )}
                        {serviceToEdit ? "Edit Service" : "Create New Service"}
                    </DialogTitle>
                    <DialogDescription>
                        {serviceToEdit
                            ? "Modify the details of your service package."
                            : "Add a new cleaning service to your catalog."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-4"
                    >
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <FormLabel>Service Icon</FormLabel>
                            <input
                                type="file"
                                id="icon-upload-modal"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="icon-upload-modal"
                                className={`
                                    relative flex flex-col items-center justify-center w-full h-40
                                    border-2 border-dashed rounded-xl cursor-pointer transition-all
                                    hover:bg-muted/50
                                    ${previewUrl ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 bg-muted/5"}
                                `}
                            >
                                {previewUrl ? (
                                    <>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-contain p-2 rounded-xl"
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            type="button"
                                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 shadow-md hover:bg-destructive/90 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-4">
                                        <UploadCloud className="w-8 h-8 text-muted-foreground/50 mb-2" />
                                        <p className="text-sm font-medium">
                                            Click to upload
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Name & Price Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Deep Clean"
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
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="resize-none"
                                            placeholder="Service details..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
