import { axiosClient } from "@/api/axios";

const ClientApi = {
    getCsrfToken: async () => {
        return await axiosClient.get("/sanctum/csrf-cookie", {
            baseURL: import.meta.env.VITE_API_BASE_URL,
        });
    },

    login: async (values) => {
        return await axiosClient.post("/login", values);
    },
    logout: async () => {
        return await axiosClient.post("/logout");
    },
    register: async (values) => {
        return await axiosClient.post("/register", values);
    },

    getClient: async () => {
        return await axiosClient.get("/user");
    },
};

export default ClientApi;
