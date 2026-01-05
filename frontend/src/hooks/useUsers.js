import { useQuery } from "@tanstack/react-query";
import AdminApi from "@/Services/AdminApi";

const fetchUsers = async () => {
    const { data } = await AdminApi.getAllUsers();
    // Handle different API response structures (array vs object)
    return data.users || data;
};

export function useUsers() {
    const {
        data = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    return {
        users: data,
        loading: isLoading,
        error: isError
            ? error?.message || "An unexpected error occurred"
            : null,
        refetch,
    };
}
export const useUserDetails = (userId) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const response = await AdminApi.getUserDetails(userId);
            return response.data;
        },
        enabled: !!userId, // Only run if an ID is provided
    });
};
