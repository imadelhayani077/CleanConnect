import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Lock, Upload } from "lucide-react";
import { useUpdateService } from "@/Hooks/useServices";
import { toast } from "sonner";

export default function ServiceUpdateModal({ isOpen, onClose, service }) {
    const updateMutation = useUpdateService();
    const [file, setFile] = useState(null);

    // Initialize with empty arrays to prevent mapping errors
    const [options, setOptions] = useState([]);
    const [extras, setExtras] = useState([]);

    // Sync state whenever the modal opens or the service changes
    useEffect(() => {
        if (service && isOpen) {
            setOptions(service.options || []);
            setExtras(service.extras || []);
            setFile(null);
        }
    }, [service, isOpen]);

    // HANDLER FOR OPTIONS
    const handleOptionChange = (id, field, value) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === id ? { ...opt, [field]: value } : opt,
            ),
        );
    };

    // HANDLER FOR EXTRAS
    const handleExtraChange = (id, field, value) => {
        setExtras((prev) =>
            prev.map((extra) =>
                extra.id === id ? { ...extra, [field]: value } : extra,
            ),
        );
    };

    const onSave = () => {
        const fd = new FormData();
        fd.append("_method", "PUT"); // Required for Laravel multipart

        if (file) fd.append("service_icon", file);

        options.forEach((opt, index) => {
            fd.append(`options[${index}][id]`, opt.id);
            fd.append(`options[${index}][name]`, opt.name);
            fd.append(`options[${index}][option_price]`, opt.option_price);
            fd.append(
                `options[${index}][duration_minutes]`,
                opt.duration_minutes,
            );
        });

        extras.forEach((extra, index) => {
            fd.append(`extras[${index}][id]`, extra.id);
            fd.append(`extras[${index}][name]`, extra.name);
            fd.append(`extras[${index}][extra_price]`, extra.extra_price);
            fd.append(
                `extras[${index}][duration_minutes]`,
                extra.duration_minutes,
            );
        });

        updateMutation.mutate(
            { id: service.id, data: fd },
            {
                onSuccess: () => {
                    toast.success("Pricing updated successfully!");
                    onClose();
                },
                onError: (err) => {
                    console.error(err.response?.data);
                    toast.error(err.response?.data?.message || "Update failed");
                },
            },
        );
    };

    if (!service) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 h-[90vh]">
                <DialogHeader className="p-6 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        Pricing Setup: {service.name}{" "}
                        <Lock className="w-4 h-4 text-muted-foreground" />
                    </DialogTitle>
                    <DialogDescription>
                        Set the base prices and durations for this service.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 h-[1px]">
                    {" "}
                    {/* h-[1px] forces viewport height */}
                    <div className="p-6 space-y-8">
                        {/* 1. Icon Upload */}
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">
                                Service Icon
                            </Label>
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                                <div className="w-12 h-12 bg-white rounded border flex items-center justify-center overflow-hidden">
                                    {file ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={`http://localhost:8000${service.service_icon}`}
                                            className="w-8 h-8 object-contain"
                                        />
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    className="flex-1"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        </div>

                        {/* 2. Options List */}
                        <div className="space-y-4">
                            <Label className="text-sm font-bold text-primary">
                                Service Options (Size/Duration)
                            </Label>
                            {options.map((opt) => (
                                <div
                                    key={`opt-${opt.id}`}
                                    className="grid grid-cols-12 gap-3 items-end p-3 border rounded-lg"
                                >
                                    <div className="col-span-6">
                                        <Label className="text-[10px] text-muted-foreground">
                                            Option Name
                                        </Label>
                                        <div className="text-sm font-medium py-2">
                                            {opt.name}
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-[10px]">
                                            Price ($)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={opt.option_price ?? ""}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    opt.id,
                                                    "option_price",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-[10px]">
                                            Minutes
                                        </Label>
                                        <Input
                                            type="number"
                                            value={opt.duration_minutes ?? ""}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    opt.id,
                                                    "duration_minutes",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 3. Extras List */}
                        <div className="space-y-4 pb-10">
                            <Label className="text-sm font-bold text-primary">
                                Extra Tasks (Add-ons)
                            </Label>
                            {extras.map((extra) => (
                                <div
                                    key={`extra-${extra.id}`}
                                    className="grid grid-cols-12 gap-3 items-end p-3 border border-dashed rounded-lg"
                                >
                                    <div className="col-span-6">
                                        <Label className="text-[10px] text-muted-foreground">
                                            Task
                                        </Label>
                                        <div className="text-sm font-medium py-2">
                                            {extra.name}
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-[10px]">
                                            Add-on ($)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={extra.extra_price ?? ""}
                                            onChange={(e) =>
                                                handleExtraChange(
                                                    extra.id,
                                                    "extra_price",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-[10px]">
                                            Add Mins
                                        </Label>
                                        <Input
                                            type="number"
                                            value={extra.duration_minutes ?? ""}
                                            onChange={(e) =>
                                                handleExtraChange(
                                                    extra.id,
                                                    "duration_minutes",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-4 border-t shrink-0">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending
                            ? "Saving..."
                            : "Save Pricing"}
                        <Save className="ml-2 w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
