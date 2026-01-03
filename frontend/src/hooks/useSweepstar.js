import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";
import AdminApi from "@/Services/AdminApi";

/* ========= API helpers ========= */

const fetchPendingApplicationsRequest = async () => {
    const res = await AdminApi.getPendingApplications();
    return res.data;
};

const applyToBecomeSweepstarRequest = async (data) => {
    const res = await ClientApi.applyToBecomeSweepstar(data);
    return res.data;
};

const approveApplicationRequest = async (id) => {
    const res = await AdminApi.approveSweepstar(id);
    return res.data;
};

const rejectApplicationRequest = async (id) => {
    const res = await AdminApi.rejectSweepstar(id);
    return res.data;
};

/* ========= query hook (admin) ========= */

export const useSweepstarApplications = () => {
    const {
        data: applications,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["sweepstar", "applications", "pending"],
        queryFn: fetchPendingApplicationsRequest,
    });

    return { applications, isLoading, isError, error };
};

/* ========= mutation hooks ========= */

// client: apply
export const useApplySweepstar = () => {
    const {
        mutateAsync: applyToBecomeSweepstar,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: applyToBecomeSweepstarRequest,
    });

    const errorMessage =
        error?.response?.data?.message ||
        (isError ? "Application failed" : null);

    return { applyToBecomeSweepstar, isLoading, isError, error, errorMessage };
};

// admin: approve
export const useApproveSweepstar = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: approveApplication,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: approveApplicationRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sweepstar", "applications", "pending"],
            });
        },
    });

    return { approveApplication, isLoading, isError, error };
};

// admin: reject
export const useRejectSweepstar = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: rejectApplication,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: rejectApplicationRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sweepstar", "applications", "pending"],
            });
        },
    });

    return { rejectApplication, isLoading, isError, error };
};
