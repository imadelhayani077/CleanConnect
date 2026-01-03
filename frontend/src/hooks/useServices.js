import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ServiceApi from "@/Services/ServiceApi";

/* ========= API helpers ========= */

const normalizeServices = (response) => {
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data))
        return response.data.data;
    if (response.data && Array.isArray(response.data.services))
        return response.data.services;
    return [];
};

const fetchServicesRequest = async () => {
    const response = await ServiceApi.getAllServices();
    return normalizeServices(response);
};

const createServiceRequest = async (data) => {
    const response = await ServiceApi.createService(data);
    return response.data.service || response.data;
};

const updateServiceRequest = async ({ id, data }) => {
    const response = await ServiceApi.updateService(id, data);
    return response.data.service || response.data;
};

const deleteServiceRequest = async (id) => {
    await ServiceApi.deleteService(id);
    return id;
};

/* ========= query hook ========= */

export const useServices = () => {
    const {
        data: services,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["services"],
        queryFn: fetchServicesRequest,
    });

    return { services, isLoading, isError, error };
};

/* ========= mutation hooks ========= */

export const useCreateService = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: createService,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: createServiceRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });

    return { createService, isLoading, isError, error };
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: updateService,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: updateServiceRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });

    return { updateService, isLoading, isError, error };
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: deleteService,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: deleteServiceRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });

    return { deleteService, isLoading, isError, error };
};
