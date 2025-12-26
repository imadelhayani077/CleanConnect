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
};

export default ClientApi;
