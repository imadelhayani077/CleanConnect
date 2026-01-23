import React from "react";
import { AlertTriangle, Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    variant = "destructive", // "destructive" (red) or "default" (blue/primary)
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] gap-0 p-0 overflow-hidden border-border/60">
                <div
                    className={`p-6 flex flex-col items-center text-center gap-4 ${variant === "destructive" ? "bg-red-50/50 dark:bg-red-900/10" : "bg-muted/30"}`}
                >
                    <div
                        className={`p-3 rounded-full ${variant === "destructive" ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}`}
                    >
                        {variant === "destructive" ? (
                            <AlertTriangle className="w-6 h-6" />
                        ) : (
                            <Info className="w-6 h-6" />
                        )}
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground mt-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="p-6 bg-background border-t border-border/60 gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto mt-2 sm:mt-0 mx-2"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={
                            variant === "destructive"
                                ? "destructive"
                                : "default"
                        }
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full sm:w-auto mx-2"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
