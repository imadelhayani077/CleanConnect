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
        refetchInterval: 30000,
    });

    // Mark Single Read
    const markReadMutation = useMutation({
        mutationFn: NotificationApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    // --- ADD THIS (Mark All Mutation) ---
    const markAllReadMutation = useMutation({
        mutationFn: NotificationApi.markAllAsRead,
        onSuccess: () => {
            // Refresh the list immediately after success
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return {
        notifications,
        markRead: markReadMutation.mutate,
        // We export mutateAsync so the button can 'await' it if needed
        markAllRead: markAllReadMutation.mutateAsync,
    };
};
