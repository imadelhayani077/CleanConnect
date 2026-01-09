import { axiosClient } from "@/api/axios";

const NotificationApi = {
    getNotifications: async () => {
        return await axiosClient.get("/api/notifications");
    },
    markAsRead: async (id) => {
        return await axiosClient.post(`/api/notifications/${id}/read`);
    },
};

export default NotificationApi;
