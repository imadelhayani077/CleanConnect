// src/hooks/useAddresses.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";

// API calls
const fetchAddresses = async () => {
    const response = await ClientApi.getMyAddresses();
    return response.data.addresses || response.data;
};

const addAddressRequest = async (newAddressData) => {
    const response = await ClientApi.addAddress(newAddressData);
    return response.data.address;
};

const deleteAddressRequest = async (id) => {
    await ClientApi.deleteAddress(id);
    return id;
};

/* ========= query hook ========= */

export const useAddresses = () => {
    const {
        data: addresses,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["addresses"],
        queryFn: fetchAddresses,
    });

    return { addresses, isLoading, isError, error };
};

/* ========= mutation hooks ========= */

export const useCreateAddress = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: createAddress,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: addAddressRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });

    return { createAddress, isLoading, isError, error };
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: deleteAddress,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: deleteAddressRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });

    return { deleteAddress, isLoading, isError, error };
};
