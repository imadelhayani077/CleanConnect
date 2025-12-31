import { axiosClient } from "@/api/axios";

const ServiceApi = {
    // 1. Get all services (Public)
    getAllServices: async () => {
        return await axiosClient.get("/api/services");
    },

    // 2. Create a service (Admin Only - you can use this later)
    createService: async (data) => {
        return await axiosClient.post("/api/services", data);
    },

    // 3. Delete Service (Admin Only)
    deleteService: async (id) => {
        return await axiosClient.delete(`/api/services/${id}`);
    },
};

export default ServiceApi;
