import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ServiceApi from "@/Services/ServiceApi";

/*
    -------------------------------------------
    HELPER: Handle messy API responses
    -------------------------------------------
    Your backend might return data in different ways (Pagination, Wrappers, etc.).
    This function cleans it up so the rest of the app just sees a simple Array.
*/
const parseServiceResponse = (response) => {
    const data = response.data;

    // Case 1: Backend returns direct array [ ... ]
    if (Array.isArray(data)) return data;

    // Case 2: Laravel Pagination { data: [ ... ] }
    if (data && Array.isArray(data.data)) return data.data;

    // Case 3: Custom wrapper { services: [ ... ] }
    if (data && Array.isArray(data.services)) return data.services;

    // Default: Return empty array if nothing matches
    return [];
};

/*
    -------------------------------------------
    PART 1: FETCH SERVICES (GET)
    -------------------------------------------
*/
export const useServices = () => {
    return useQuery({
        queryKey: ["services"], // Unique ID for cache
        queryFn: async () => {
            const response = await ServiceApi.getAllServices();
            // Use our helper to extract the array cleanly
            return parseServiceResponse(response);
        },
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    });
};

/*
    -------------------------------------------
    PART 2: ADD SERVICE (POST)
    -------------------------------------------
*/
export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newServiceData) => {
            return await ServiceApi.createService(newServiceData);
        },
        onSuccess: () => {
            // Tell React Query to re-fetch the list immediately
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (error) => {
            console.error("Failed to add service", error);
        },
    });
};

/*
    -------------------------------------------
    PART 3: UPDATE SERVICE (PUT)
    -------------------------------------------
*/
export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // MutationFn expects ONE variable. We pass an object { id, data }.
        mutationFn: async ({ id, data }) => {
            return await ServiceApi.updateService(id, data);
        },
        onSuccess: () => {
            // Re-fetch list to show updated data
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (error) => {
            console.error("Failed to update service", error);
        },
    });
};

/*
    -------------------------------------------
    PART 4: DELETE SERVICE (DELETE)
    -------------------------------------------
*/
export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            // Note: We moved the "window.confirm" logic to the UI component.
            // Hooks should only handle data, not UI alerts.
            return await ServiceApi.deleteService(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (error) => {
            console.error("Failed to delete service", error);
        },
    });
};
