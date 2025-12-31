import React, { useState } from "react"; // Import useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useServiceContext } from "@/Helper/ServiceContext";
// Add Pencil and X (Cancel) icons
import { Loader2, Trash2, PlusCircle, Pencil, X } from "lucide-react";

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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Service name must be at least 2 characters.",
    }),
    base_price: z.coerce
        .number()
        .min(1, { message: "Price must be at least $1." }),
});

export default function ServiceManager() {
    // 1. Get updateService from context
    const { services, addService, deleteService, updateService, loading } =
        useServiceContext();

    // 2. Local state to track which ID we are editing
    const [editingId, setEditingId] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            base_price: "",
        },
    });

    // 3. Handle Submit (Switch between Add and Update)
    const onSubmit = async (values) => {
        const payload = {
            name: values.name,
            base_price: values.base_price,
            description: "Standard Service",
        };

        let success = false;

        if (editingId) {
            // UPDATE MODE
            success = await updateService(editingId, payload);
        } else {
            // CREATE MODE
            success = await addService(payload);
        }

        if (success) {
            form.reset({ name: "", base_price: "" }); // Clear form
            setEditingId(null); // Exit edit mode
        } else {
            alert("Action failed. Check console.");
        }
    };

    // 4. Function to start editing
    const handleEditClick = (service) => {
        setEditingId(service.id);
        // Fill the form with the selected service data
        form.setValue("name", service.name);
        form.setValue("base_price", service.base_price);
        // Scroll to top to show the user the form is ready
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 5. Function to cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        form.reset({ name: "", base_price: "" });
    };

    return (
        <div className="p-6 space-y-8">
            <Card className={editingId ? "border-blue-500 shadow-md" : ""}>
                <CardHeader>
                    {/* Dynamic Title */}
                    <CardTitle>
                        {editingId ? "Update Service" : "Add New Service"}
                    </CardTitle>
                    <CardDescription>
                        {editingId
                            ? "Modify the details below and save."
                            : "Create a new service offering for clients."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col md:flex-row gap-4 items-start md:items-end"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1 w-full">
                                        <FormLabel>Service Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Deep Cleaning"
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
                                    <FormItem className="w-full md:w-48">
                                        <FormLabel>Base Price ($)</FormLabel>
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

                            <div className="flex gap-2">
                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={
                                        editingId
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : ""
                                    }
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : editingId ? (
                                        <>
                                            <Pencil className="mr-2 h-4 w-4" />{" "}
                                            Update
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" />{" "}
                                            Add
                                        </>
                                    )}
                                </Button>

                                {/* Cancel Button (Only show when editing) */}
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Services</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading && !services.length ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Service Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services && services.length > 0 ? (
                                        services.map((service, index) => (
                                            <TableRow key={service.id || index}>
                                                <TableCell className="font-medium">
                                                    #{service.id}
                                                </TableCell>
                                                <TableCell>
                                                    {service.name}
                                                </TableCell>
                                                <TableCell className="text-green-600 font-bold">
                                                    $
                                                    {service.base_price ||
                                                        service.price}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    {/* EDIT BUTTON */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                service
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>

                                                    {/* DELETE BUTTON */}
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteService(
                                                                service.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center"
                                            >
                                                No services found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
