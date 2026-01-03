// src/hooks/useUserAndAuth.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";
import AdminApi from "@/Services/AdminApi";

/* ========= CURRENT USER ========= */

const fetchUser = async () => {
    const { data } = await ClientApi.getClient();
    return data;
};

export const useUser = () => {
    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        retry: false,
    });

    const authenticated = !!user;
    const isRole = (role) => user?.role === role;

    return { user, authenticated, isLoading, isError, error, isRole };
};

/* ========= AUTH ACTIONS ========= */

export const useAuth = () => {
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (values) => {
            await ClientApi.getCsrfToken();
            const res = await ClientApi.login(values);
            const { data } = await ClientApi.getClient();
            queryClient.setQueryData(["user"], data);
            window.localStorage.setItem("Authenticated", "true");
            return res;
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (values) => {
            await ClientApi.getCsrfToken();
            return await ClientApi.register(values);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            try {
                await ClientApi.logout();
            } catch (e) {
                console.error(e);
            }
            window.localStorage.removeItem("Authenticated");
            queryClient.removeQueries({ queryKey: ["user"] });
        },
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isLoading,
        loginError: loginMutation.error,

        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isLoading,
        registerError: registerMutation.error,

        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isLoading,
        logoutError: logoutMutation.error,
    };
};

/* ========= ADMIN USERS LIST ========= */

const fetchAdminUsers = async () => {
    const { data } = await AdminApi.getUsers();
    return data.users || data;
};

export const useAdminUserList = () => {
    const {
        data: users,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: fetchAdminUsers,
    });

    return { users, isLoading, isError, error };
};

/* ========= ADMIN SINGLE USER ========= */

const fetchAdminUser = async (id) => {
    const { data } = await AdminApi.getUser(id);
    return data.user || data;
};

export const useAdminUser = (id, enabled = !!id) => {
    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["admin", "users", id],
        queryFn: () => fetchAdminUser(id),
        enabled,
    });

    return { user, isLoading, isError, error };
};
