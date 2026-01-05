import { useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";

// 1. Submit New Review
export const useSubmitReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => ClientApi.submitReview(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

// 2. Update Review (NEW)
export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => ClientApi.updateReview(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

// 3. Delete Review (NEW)
export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => ClientApi.deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};
