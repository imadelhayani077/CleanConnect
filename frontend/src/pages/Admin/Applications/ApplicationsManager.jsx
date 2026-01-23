// src/components/applications/ApplicationManager.jsx
import React, { useState } from "react";
import { UserCheck, Loader2, AlertCircle } from "lucide-react";
import {
    usePendingApplications,
    useApproveApplication,
    useRejectApplication,
} from "@/Hooks/useSweepstar";

import { Alert, AlertDescription } from "@/components/ui/alert";
import ApplicationsStatCards from "./components/ApplicationsStatCards";
import ApplicationSearch from "./components/ApplicationsSearch";
import ApplicationsTable from "./components/ApplicationsTable";
import ApplicationDetailModal from "./components/ApplicationDetailModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal"; // [!code focus] 1. Import it

export default function ApplicationManager() {
    const {
        data: applications = [],
        isLoading,
        isError,
    } = usePendingApplications();

    const approveMutation = useApproveApplication();
    const rejectMutation = useRejectApplication();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);

    // [!code focus] 2. Add state to track confirmation logic
    const [confirmState, setConfirmState] = useState({
        open: false,
        type: null, // 'APPROVE' or 'REJECT'
        id: null,
        name: null, // Optional: for displaying the name in the message
    });

    const filteredApps = applications.filter((app) => {
        const term = searchTerm.toLowerCase();
        return (
            (app.user?.name || "").toLowerCase().includes(term) ||
            (app.user?.email || "").toLowerCase().includes(term)
        );
    });

    // [!code focus] 3. Trigger the Modal for Approval
    const handleApproveClick = (id, name) => {
        setConfirmState({
            open: true,
            type: "APPROVE",
            id,
            name,
        });
    };

    // [!code focus] 4. Trigger the Modal for Rejection
    const handleRejectClick = (id, name) => {
        setConfirmState({
            open: true,
            type: "REJECT",
            id,
            name,
        });
    };

    // [!code focus] 5. The actual function that runs when user clicks "Confirm" in the modal
    const handleFinalConfirmation = async () => {
        const { type, id } = confirmState;

        try {
            if (type === "APPROVE") {
                await approveMutation.mutateAsync(id);
            } else if (type === "REJECT") {
                await rejectMutation.mutateAsync(id);
            }
            // Close modal on success
            setConfirmState({ ...confirmState, open: false });
        } catch (error) {
            console.error("Action failed", error);
            // Optional: Keep modal open or show error toast
        }
    };

    if (isLoading) return <Loader2 className="animate-spin" />; // (Simplified for brevity)
    if (isError) return <AlertDescription>Error loading</AlertDescription>; // (Simplified)

    // Calculate dynamic modal text based on the action type
    const getModalContent = () => {
        if (confirmState.type === "APPROVE") {
            return {
                title: "Approve Sweepstar?",
                description: `Are you sure you want to promote ${confirmState.name || "this applicant"} to a Sweepstar? They will gain access to bookings immediately.`,
                variant: "default", // Blue/Primary color
                confirmText: "Approve Application",
            };
        }
        return {
            title: "Reject Application?",
            description:
                "Are you sure you want to reject this application? This action cannot be undone and the user will be notified.",
            variant: "destructive", // Red color
            confirmText: "Reject Application",
        };
    };

    const modalContent = getModalContent();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6">
            {/* ... Header and Stats (same as before) ... */}

            <ApplicationsStatCards
                applicationsCount={applications.length}
                filteredCount={filteredApps.length}
                avgRate="0.00" // calculate logic here
            />

            <ApplicationSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <ApplicationsTable
                applications={filteredApps}
                searchTerm={searchTerm}
                // [!code focus] 6. Pass our new click handlers instead of the direct mutations
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
                isApproving={false} // We handle loading in the modal now
                isRejecting={false}
                onViewDetails={setSelectedApp}
            />

            <ApplicationDetailModal
                application={selectedApp}
                open={!!selectedApp}
                onClose={() => setSelectedApp(null)}
            />

            {/* [!code focus] 7. Render the Generic Confirmation Modal */}
            <ConfirmationModal
                open={confirmState.open}
                onClose={() =>
                    setConfirmState({ ...confirmState, open: false })
                }
                onConfirm={handleFinalConfirmation}
                title={modalContent.title}
                description={modalContent.description}
                variant={modalContent.variant}
                confirmText={modalContent.confirmText}
                isLoading={
                    approveMutation.isPending || rejectMutation.isPending
                }
            />
        </div>
    );
}
