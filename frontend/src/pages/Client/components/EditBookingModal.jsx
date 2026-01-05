import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useServices } from "@/Hooks/useServices";
import { useAddress } from "@/Hooks/useAddress";
import { useEditBooking } from "@/Hooks/useBookings";

export default function EditBookingModal({
    booking,
    isOpen,
    onClose,
    onSuccess,
}) {
    // Hooks
    const { data: services = [] } = useServices();
    const { addresses } = useAddress();
    const { mutateAsync: updateBooking, isPending } = useEditBooking();

    // Local State (Moved from Parent)
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [addressId, setAddressId] = useState("");
    const [serviceIds, setServiceIds] = useState([]);
    const [error, setError] = useState(null);

    // Initialize state when booking opens
    useEffect(() => {
        if (booking) {
            setDate(
                format(new Date(booking.scheduled_at), "yyyy-MM-dd'T'HH:mm")
            );
            setNotes(booking.notes || "");
            setAddressId(booking.address_id?.toString() || "");
            setServiceIds(booking.services?.map((s) => s.id) || []);
            setError(null);
        }
    }, [booking]);

    const handleSave = async () => {
        try {
            const payload = {
                scheduled_at: new Date(date).toISOString(),
                notes: notes,
                address_id: addressId,
                service_ids: serviceIds,
            };
            await updateBooking({ id: booking.id, data: payload });
            onSuccess("Booking updated successfully.");
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        }
    };

    const toggleService = (id) => {
        setServiceIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Calculate Total
    const total = services
        .filter((s) => serviceIds.includes(s.id))
        .reduce((sum, s) => sum + Number(s.base_price), 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Booking</DialogTitle>
                    <DialogDescription>Modify details below.</DialogDescription>
                </DialogHeader>

                {/* ... Render your Inputs, Selects, Checkboxes here using local state ... */}
                {/* Example: */}
                <div className="grid gap-4 py-4">
                    <Label>Estimated Total: ${total.toFixed(2)}</Label>
                    <Input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    {/* ... other inputs ... */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}{" "}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
