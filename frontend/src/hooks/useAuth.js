import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";
import { useNavigate } from "react-router-dom";

// 1. Helper to check if we should even try fetching the user
// This prevents 401 errors on the login page by checking LocalStorage first
const getStoredAuth = () =>
    window.localStorage.getItem("Authenticated") === "true";

/*
    -------------------------------------------
    PART 1: FETCH CURRENT USER (GET)
    -------------------------------------------
*/
export const useUser = () => {
    return useQuery({
        queryKey: ["user"],

        // Only run this query if LocalStorage says we are logged in.
        // This stops the app from constantly checking the API if the user is a guest.
        enabled: getStoredAuth(),

        queryFn: async () => {
            try {
                const { data } = await ClientApi.getClient();
                return data; // This becomes your 'user' object
            } catch (error) {
                // If the session expired (401), clean up localStorage
                if (error.response?.status === 401) {
                    window.localStorage.removeItem("Authenticated");
                }
                throw error;
            }
        },
        retry: false, // If 401, fail immediately. Don't retry.
        staleTime: Infinity, // User data doesn't change often, keep it fresh forever
    });
};

/*
    -------------------------------------------
    PART 2: LOGIN (Mutation)
    -------------------------------------------
*/
// in useAuth.js
export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (values) => {
            await ClientApi.getCsrfToken();
            return await ClientApi.login(values);
        },
        onSuccess: async () => {
            localStorage.setItem("Authenticated", "true");
            // refetch user and wait until it's there
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/dashboard", { replace: true });
        },
    });
};

/*
    -------------------------------------------
    PART 3: REGISTER (Mutation)
    -------------------------------------------
*/
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values) => {
            await ClientApi.getCsrfToken();
            return await ClientApi.register(values);
        },
        onSuccess: () => {
            window.localStorage.setItem("Authenticated", "true");
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};

/*
    -------------------------------------------
    PART 4: LOGOUT (Mutation)
    -------------------------------------------
*/
export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            return await ClientApi.logout();
        },
        onSettled: () => {
            // "onSettled" runs whether the API succeeded or failed.
            // We always want to clear local state.

            window.localStorage.removeItem("Authenticated");

            // WIPE the user data from the cache immediately
            queryClient.setQueryData(["user"], null);

            navigate("/login");
        },
    });
};
