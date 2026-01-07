import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/Hooks/useAuth";
import DashboardApi from "@/Services/DashboardApi";

export const useDashboard = () => {
    const { data: user } = useUser();
    const role = user?.role;

    // 1. ADMIN QUERY
    const adminQuery = useQuery({
        queryKey: ["dashboard", "admin"],
        queryFn: DashboardApi.AdminDashboardStats,
        enabled: role === "admin", // Only run if admin
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // 2. SWEEPSTAR QUERY
    const sweepstarQuery = useQuery({
        queryKey: ["dashboard", "sweepstar"],
        queryFn: DashboardApi.SweepstarDashboardStats,
        enabled: role === "sweepstar",
        staleTime: 1000 * 60 * 2,
    });

    // 3. CLIENT QUERY
    const clientQuery = useQuery({
        queryKey: ["dashboard", "client"],
        queryFn: DashboardApi.ClientDashboardStats,
        enabled: role === "client",
        staleTime: 1000 * 60 * 5,
    });

    // Return the correct data based on role
    return {
        // Admin Data
        adminStats: adminQuery.data,
        isAdminLoading: adminQuery.isLoading,

        // Sweepstar Data
        sweepstarStats: sweepstarQuery.data,
        isSweepstarLoading: sweepstarQuery.isLoading,

        // Client Data
        clientStats: clientQuery.data,
        isClientLoading: clientQuery.isLoading,

        // General Error
        error: adminQuery.error || sweepstarQuery.error || clientQuery.error,
    };
};
