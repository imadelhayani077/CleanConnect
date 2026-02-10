import { axiosClient } from "@/api/axios";

const ServiceApi = {
    // 1. Get all services (Public)
    getAllServices: async () => {
        return await axiosClient.get("/api/services");
    },

    updateService: async (id, formData) => {
        // Laravel sometimes struggles with PUT + FormData.
        // A common trick is using POST with _method: "PUT"
        formData.append("_method", "PUT");
        return await axiosClient.post(`/api/services/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // 3. Delete Service (Admin Only)
    deleteService: async (id) => {
        return await axiosClient.delete(`/api/services/${id}`);
    },
};

export default ServiceApi;
