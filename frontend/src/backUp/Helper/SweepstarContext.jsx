import React, { createContext, useContext, useState } from "react";
import ClientApi from "../Services/ClientApi";
import AdminApi from "../Services/AdminApi";

const SweepstarStateContext = createContext({
    applications: [],
    applyToBecomeSweepstar: async () => {},
    fetchPendingApplications: async () => {},
    approveApplication: async () => {},
    rejectApplication: async () => {},
});

export default function SweepstarContext({ children }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // --- CLIENT ACTION: Apply ---
    const applyToBecomeSweepstar = async (data) => {
        setLoading(true);
        setErrors(null);
        try {
            await ClientApi.applyToBecomeSweepstar(data);
            // You might want to trigger a notification here
            return true;
        } catch (error) {
            setErrors(error.response?.data?.message || "Application failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- ADMIN ACTION: Get List ---
    const fetchPendingApplications = async () => {
        setLoading(true);
        try {
            const response = await AdminApi.getPendingApplications();
            setApplications(response.data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    // --- ADMIN ACTION: Approve ---
    const approveApplication = async (id) => {
        try {
            await AdminApi.approveSweepstar(id);
            // Remove the approved user from the local list immediately
            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    // --- ADMIN ACTION: Reject ---
    const rejectApplication = async (id) => {
        try {
            await AdminApi.rejectSweepstar(id);
            // Remove the rejected user from the list
            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (error) {
            console.error("Failed to reject", error);
        }
    };

    return (
        <SweepstarStateContext.Provider
            value={{
                applications,
                loading,
                errors,
                applyToBecomeSweepstar,
                fetchPendingApplications,
                approveApplication,
                rejectApplication,
            }}
        >
            {children}
        </SweepstarStateContext.Provider>
    );
}

export const useSweepstarContext = () => useContext(SweepstarStateContext);
