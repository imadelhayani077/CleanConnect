import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi"; // Ensure this path matches your file structure
import { useNavigate } from "react-router-dom";

// 1. Helper to check if we should even try fetching the user
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
        enabled: getStoredAuth(),
        queryFn: async () => {
            try {
                const { data } = await ClientApi.getClient();
                return data;
            } catch (error) {
                if (error.response?.status === 401) {
                    window.localStorage.removeItem("Authenticated");
                }
                throw error;
            }
        },
        retry: false,
        staleTime: Infinity,
    });
};

/*
    -------------------------------------------
    PART 2: LOGIN (Mutation)
    -------------------------------------------
*/
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
            window.localStorage.removeItem("Authenticated");
            queryClient.setQueryData(["user"], null);
            navigate("/login");
        },
    });
};

/*
    -------------------------------------------
    PART 5: UPDATE PROFILE (Mutation)
    -------------------------------------------
*/
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // Expects an object with { id, data } when you call .mutate()
        mutationFn: async ({ id, data }) => {
            return await ClientApi.updateProfile(id, data);
        },
        onSuccess: () => {
            // Crucial: This refreshes the "user" query so the UI updates instantly
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};
