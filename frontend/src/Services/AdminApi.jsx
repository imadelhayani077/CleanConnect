import { axiosClient } from "@/api/axios";

const AdminApi = {
    // --- USERS ---
    // Fetch all users (Matches route: /api/admin/users)
    getAllUsers: async () => {
        return await axiosClient.get("/api/admin/users");
    },

    // --- BOOKINGS ---
    // Fetch all bookings for Admin Dashboard
    getAllBookings: async () => {
        return await axiosClient.get("/api/bookings");
    },

    // Update specific booking status (e.g. Approve/Reject)
    // Matches route: Route::put('/admin/bookings/{booking}/status', ...)
    updateBookingStatus: async (id, status) => {
        return await axiosClient.put(`/api/admin/bookings/${id}/status`, {
            status,
        });
    },

    // Delete a booking (Uses the standard shared resource route)
    deleteBooking: async (id) => {
        return await axiosClient.delete(`/api/bookings/${id}`);
    },
};

export default AdminApi;
