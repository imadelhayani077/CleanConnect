import { axiosClient } from "@/api/axios";

const AdminApi = {
    // Fetch all users (The function we need now)
    getAllUsers: async () => {
        return await axiosClient.get("/api/all-users");
    },

    // Example: Future function to delete a user
    // deleteUser: async (id) => {
    //     return await axiosClient.delete(`/api/users/${id}`);
    // },

    // // Example: Future function to approve a booking
    // approveBooking: async (bookingId) => {
    //     return await axiosClient.post(`/api/bookings/${bookingId}/approve`);
    // }
};

export default AdminApi;
