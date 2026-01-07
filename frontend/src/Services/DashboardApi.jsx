import { axiosClient } from "@/api/axios";

const DashboardApi = {
    AdminDashboardStats: async () => {
        return await axiosClient.get("/api/admin/dashboard-stats");
    },
    SweepstarDashboardStats: async () => {
        return await axiosClient.get("/api/sweepstar/dashboard-stats");
    },
    ClientDashboardStats: async () => {
        return await axiosClient.get("/api/user/dashboard-stats");
    },
};

export default DashboardApi;
