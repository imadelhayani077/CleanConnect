import React, { createContext, useContext, useState, useEffect } from "react";
import ClientApi from "@/Services/ClientApi";

// 1. Create the Context
const AddressStateContext = createContext({
    addresses: {},
    addAddress: (values) => {},
    loading: true,
    deleteAddress: (id) => {},
    fetchAddresses: () => {},
});

// 2. Create the Provider Component
export default function AddressContext({ children }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch addresses once when the app loads
    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await ClientApi.getMyAddresses();
            setAddresses(response.data.addresses || response.data);
        } catch (error) {
            console.error("Failed to load addresses context", error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize data
    useEffect(() => {
        fetchAddresses();
    }, []);

    // Helper: Add Address (Updates API + Local State)
    const addAddress = async (newAddressData) => {
        try {
            const response = await ClientApi.addAddress(newAddressData);
            const savedAddress = response.data.address;

            // Update local state immediately (no need to refetch entire list)
            setAddresses([...addresses, savedAddress]);
            return { success: true };
        } catch (error) {
            console.error("Context: Add Address Failed", error);
            return { success: false, error };
        }
    };

    // Helper: Delete Address (Updates API + Local State)
    const deleteAddress = async (id) => {
        try {
            await ClientApi.deleteAddress(id);
            // Remove from local state
            setAddresses(addresses.filter((addr) => addr.id !== id));
        } catch (error) {
            console.error("Context: Delete Failed", error);
        }
    };

    return (
        <AddressStateContext.Provider
            value={{
                addresses,
                loading,
                addAddress,
                deleteAddress,
                fetchAddresses,
            }}
        >
            {children}
        </AddressStateContext.Provider>
    );
}

// 3. Custom Hook for easy usage
export const useAddress = () => useContext(AddressStateContext);
