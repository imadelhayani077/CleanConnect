import { axiosClient } from "@/api/axios";

const ClientApi = {
    getCsrfToken: async () => {
        // This is the ONLY route that does NOT have /api
        return await axiosClient.get("/sanctum/csrf-cookie");
    },

    login: async (values) => {
        // MATCHES YOUR ROUTE LIST: api/login
        return await axiosClient.post("/api/login", values);
    },

    logout: async () => {
        // MATCHES YOUR ROUTE LIST: api/logout
        return await axiosClient.post("/api/logout");
    },

    register: async (values) => {
        // MATCHES YOUR ROUTE LIST: api/register
        return await axiosClient.post("/api/register", values);
    },

    getClient: async () => {
        // MATCHES YOUR ROUTE LIST: api/user
        return await axiosClient.get("/api/user");
    },
    // --- ADDRESSES ---
    // Get all my addresses
    getMyAddresses: async () => {
        return await axiosClient.get("/api/addresses");
    },
    // Add a new address
    addAddress: async (data) => {
        return await axiosClient.post("/api/addresses", data);
    },
    // Delete an address
    deleteAddress: async (id) => {
        return await axiosClient.delete(`/api/addresses/${id}`);
    },

    // --- BOOKINGS ---
    // Create a new booking
    createBooking: async (data) => {
        return await axiosClient.post("/api/bookings", data);
    },
    // Get my booking history
    getMyBookings: async () => {
        return await axiosClient.get("/api/bookings");
    },
    // Update an existing booking
    updateBooking: async (id, data) => {
        return await axiosClient.put(`/api/bookings/${id}`, data);
    },
    applyToBecomeSweepstar: async (data) => {
        return await axiosClient.post("/api/sweepstar/apply", data);
    },
};

export default ClientApi;
