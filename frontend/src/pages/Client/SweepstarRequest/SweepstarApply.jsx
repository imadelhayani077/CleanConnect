import React, { useState } from "react";
import { Sparkles, Shield, Loader2 } from "lucide-react"; // Added Loader2
import {
    useApplyForSweepstar,
    useCheckApplicationStatus,
} from "@/Hooks/useSweepstar"; // Import the new hook
import BecomeProForm from "./components/BecomeProForm";
import SweepstarApplicationStatusModal from "./components/SweepstarApplicationStatusModal";

export default function SweepstarApply() {
    // 1. Fetch current status on load
    const { data: existingApp, isLoading: isLoadingStatus } =
        useCheckApplicationStatus();

    const { mutateAsync: applyMutation, isPending } = useApplyForSweepstar();
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    // 2. Check if we should show the "Pending" modal
    // Condition: We have data from the backend AND the status is 'found'
    const hasPendingApplication = existingApp?.status === "found";

    const handleSubmit = async (values) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            await applyMutation(values);
            setSubmitSuccess(
                "We will review your profile and get back to you shortly.",
            );
            // The query invalidation will handle the UI update,
            // but we can also force a refresh of the status here if needed.
        } catch (error) {
            console.error("Application Error:", error);
            const status = error?.response?.status;
            // If backend says 409, it means we actually do have a pending app
            if (status === 409) {
                window.location.reload(); // Simple way to re-trigger the check
            } else {
                setSubmitError(
                    error?.response?.data?.message || "Something went wrong.",
                );
            }
        }
    };

    // 3. Show Loading State while checking backend
    if (isLoadingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // 4. If application exists, SHOW MODAL ONLY (Hide Form)
    if (hasPendingApplication || submitSuccess) {
        return <SweepstarApplicationStatusModal isPendingOnly={true} />;
    }

    // 5. Otherwise, show the normal page
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Become a <span className="text-primary">Sweepstar</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join our elite team of professionals. Set your own
                        rates, manage your schedule, and grow your business.
                    </p>
                </div>

                {/* Form Card */}
                <BecomeProForm
                    onSubmit={handleSubmit}
                    isSubmitting={isPending}
                    submitError={submitError}
                    submitSuccess={submitSuccess}
                />

                {/* Footer Trust Signal */}
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>Secure</span>
                    </div>
                    <div className="w-1 h-1 bg-border rounded-full" />
                    <span>Fast Processing</span>
                    <div className="w-1 h-1 bg-border rounded-full" />
                    <span>No Hidden Fees</span>
                </div>
            </div>
        </div>
    );
}
