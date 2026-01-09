import NotificationApi from "@/Services/NotificationApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
    const queryClient = useQueryClient();

    // Fetch Notifications
    const { data: notifications = [] } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await NotificationApi.getNotifications();
            return data.notifications;
        },
        refetchInterval: 30000, // CHECK EVERY 30 SECONDS (Polling)
    });

    // Mark as Read Mutation
    const markReadMutation = useMutation({
        mutationFn: NotificationApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return {
        notifications,
        markRead: markReadMutation.mutate,
    };
};
