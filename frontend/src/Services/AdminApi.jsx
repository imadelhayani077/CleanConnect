import { axiosClient } from "@/api/axios";

const AdminApi = {
    // --- USERS ---
    // Fetch all users
    getAllUsers: async () => {
        return await axiosClient.get("/api/admin/users");
    },
    getUserDetails: async (id) => {
        return await axiosClient.get(`/api/admin/users/${id}`);
    },

    // --- BOOKINGS ---
    // Fetch all bookings for Admin Dashboard
    // Note: Ensure your backend route '/api/bookings' returns ALL bookings when accessed by an admin
    getAllBookings: async () => {
        return await axiosClient.get("/api/bookings");
    },

    // Update specific booking status
    updateBookingStatus: async (id, status) => {
        return await axiosClient.put(`/api/admin/bookings/${id}/status`, {
            status,
        });
    },

    // Delete a booking
    deleteBooking: async (id) => {
        return await axiosClient.delete(`/api/bookings/${id}`);
    },

    // --- SWEEPSTAR APPLICATIONS ---

    // 1. Get all pending applications
    getPendingApplications: async () => {
        const res = await axiosClient.get("/api/admin/applications");
        console.log(res);

        return res;
    },

    // 2. Approve a user (Upgrades them to Sweepstar)
    approveSweepstar: async (id) => {
        return await axiosClient.post(`/api/admin/applications/${id}/approve`);
    },

    // 3. Reject a user (Deletes the application)
    rejectSweepstar: async (id) => {
        return await axiosClient.delete(`/api/admin/applications/${id}/reject`);
    },
    updateUserStatus: async (id, status) => {
        return await axiosClient.put(`/api/admin/users/${id}/status`, {
            status,
        });
    },

    // Admin delete user
    deleteUser: async (id) => {
        return await axiosClient.delete(`/api/admin/users/${id}`);
    },
};

export default AdminApi;
