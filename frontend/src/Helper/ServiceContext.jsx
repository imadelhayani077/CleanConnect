import React, { createContext, useContext, useState, useEffect } from "react";
// 1. CHANGE THIS IMPORT: Use ServiceApi instead of AdminApi
import ServiceApi from "@/Services/ServiceApi";

const ServiceStateContext = createContext();

export default function ServiceContext({ children }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load services automatically on mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await ServiceApi.getAllServices();

            let servicesArray = [];

            if (Array.isArray(response.data)) {
                // Case 1: Backend returns direct array [ ... ]
                servicesArray = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                // Case 2: Laravel Pagination { data: [ ... ] }
                servicesArray = response.data.data;
            } else if (response.data && Array.isArray(response.data.services)) {
                // Case 3: Custom wrapper { services: [ ... ] }
                servicesArray = response.data.services;
            }
            setServices(servicesArray);
        } catch (error) {
            console.error("Failed to load services", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const addService = async (data) => {
        try {
            // 3. USE ServiceApi
            const response = await ServiceApi.createService(data);

            // Extract the actual service object from the response
            const newService = response.data.service || response.data;

            setServices([...services, newService]);
            return true;
        } catch (error) {
            console.error("Failed to add service", error);
            return false;
        }
    };
    const updateService = async (id, updatedData) => {
        setLoading(true);
        try {
            const response = await ServiceApi.updateService(id, updatedData);

            // Get the updated service from response (adjust based on your backend)
            const updatedService = response.data.service || response.data;

            // Update the state immediately
            setServices((prevServices) =>
                prevServices.map((service) =>
                    service.id === id
                        ? { ...service, ...updatedService }
                        : service
                )
            );
            return true;
        } catch (error) {
            console.error("Failed to update service", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?"))
            return;

        try {
            // 4. USE ServiceApi
            await ServiceApi.deleteService(id);
            setServices(services.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Failed to delete service", error);
        }
    };

    return (
        <ServiceStateContext.Provider
            value={{
                services,
                loading,
                fetchServices,
                addService,
                updateService,
                deleteService,
            }}
        >
            {children}
        </ServiceStateContext.Provider>
    );
}

export const useServiceContext = () => useContext(ServiceStateContext);
