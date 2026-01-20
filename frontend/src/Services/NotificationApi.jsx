import { axiosClient } from "@/api/axios";

const NotificationApi = {
    getNotifications: async () => {
        return await axiosClient.get("/api/notifications");
    },
    markAsRead: async (id) => {
        return await axiosClient.post(`/api/notifications/${id}/read`);
    },
    markAllAsRead: async () => {
        return await axiosClient.post("/api/notifications/read-all");
    },
};

export default NotificationApi;
