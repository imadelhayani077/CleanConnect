import NotificationApi from "@/Services/NotificationApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await NotificationApi.getNotifications();
            return data.notifications;
        },
        refetchInterval: 30000, // Auto-refresh every 30 seconds
    });

    // 2. Mark Single Notification as Read (Optimistic)
    const markReadMutation = useMutation({
        mutationFn: NotificationApi.markAsRead,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previousNotifications = queryClient.getQueryData([
                "notifications",
            ]);

            queryClient.setQueryData(["notifications"], (old) =>
                old.map((n) =>
                    n.id === id
                        ? { ...n, read_at: new Date().toISOString() }
                        : n,
                ),
            );

            return { previousNotifications };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(
                ["notifications"],
                context.previousNotifications,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    // 3. Mark All as Read (Optimistic - Fixes the "Long Wait" issue)
    const markAllReadMutation = useMutation({
        mutationFn: NotificationApi.markAllAsRead,
        onMutate: async () => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ["notifications"] });

            // Snapshot the current data
            const previousNotifications = queryClient.getQueryData([
                "notifications",
            ]);

            // INSTANTLY update the UI to show everything as read
            queryClient.setQueryData(["notifications"], (old) =>
                old?.map((n) => ({ ...n, read_at: new Date().toISOString() })),
            );

            return { previousNotifications };
        },
        onError: (err, variables, context) => {
            // If the server fails, roll back to the previous state
            queryClient.setQueryData(
                ["notifications"],
                context.previousNotifications,
            );
        },
        onSettled: () => {
            // Finally, sync with server to ensure data integrity
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return {
        notifications,
        isLoading,
        unreadCount: notifications.filter((n) => !n.read_at).length,
        markRead: markReadMutation.mutate,
        markAllRead: markAllReadMutation.mutate, // Changed from mutateAsync to mutate for instant feel
    };
};
