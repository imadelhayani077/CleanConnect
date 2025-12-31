import React, { createContext, useContext, useState, useCallback } from "react";
import ClientApi from "@/Services/ClientApi";
import AdminApi from "@/Services/AdminApi";
import SweepstarApi from "@/Services/SweepstarApi";
import ServiceApi from "@/Services/ServiceApi"; // Make sure this path matches where you created the file

const BookingStateContext = createContext({
    bookings: [],
    loading: true,
    services: [],
    createBooking: (values) => {},
    fetchMyBookings: () => {},
    fetchAllBookings: () => {},
    editBooking: (id, updatedData) => {},
    fetchServices: () => {},
    fetchAvailableJobs: () => {},
    fetchMySchedule: () => {},
    acceptJobAssignment: (bookingId) => {},
});

export default function BookingContext({ children }) {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]); // Store services list
    const [loading, setLoading] = useState(false);

    // --- 1. SHARED: Fetch Services (For Booking Form) ---
    const fetchServices = async () => {
        try {
            const response = await ServiceApi.getAllServices();
            setServices(response.data.services);
            return response.data.services;
        } catch (error) {
            console.error("Context: Failed to load services", error);
            return [];
        }
    };

    // --- 2. CLIENT: Fetch My Bookings ---
    const fetchMyBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ClientApi.getMyBookings();
            setBookings(response.data.bookings || response.data);
        } catch (error) {
            console.error("Context: Failed to load client bookings", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- 3. ADMIN: Fetch All Bookings ---
    const fetchAllBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await AdminApi.getAllBookings();
            setBookings(response.data.bookings || response.data);
        } catch (error) {
            console.error("Context: Failed to load admin bookings", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- 4. CLIENT: Create Booking ---
    const createBooking = async (bookingData) => {
        setLoading(true);
        try {
            // Note: bookingData should now contain 'service_ids' (array)
            const response = await ClientApi.createBooking(bookingData);
            const newBooking = response.data.booking;

            // Add new booking to top of list
            setBookings([newBooking, ...bookings]);

            return { success: true };
        } catch (error) {
            console.error("Context: Create Booking Failed", error);
            const msg = error.response?.data?.message || "Booking failed";
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 5. SHARED: Edit Booking ---
    const editBooking = async (id, updatedData) => {
        try {
            const response = await ClientApi.updateBooking(id, updatedData);
            const updatedBooking = response.data.booking;

            setBookings((prevBookings) =>
                prevBookings.map((b) => (b.id === id ? updatedBooking : b))
            );
            return { success: true };
        } catch (error) {
            console.error("Context: Update Booking Failed", error);
            const msg = error.response?.data?.message || "Update failed";
            return { success: false, error: msg };
        }
    };

    // --- 6. SWEEPSTAR FUNCTIONS ---

    const fetchAvailableJobs = async () => {
        setLoading(true);
        try {
            const response = await SweepstarApi.getAvailableJobs();
            return response.data.jobs;
        } catch (error) {
            console.error("Context: Failed to load available jobs", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchMySchedule = async () => {
        setLoading(true);
        try {
            const response = await SweepstarApi.getMySchedule();
            return response.data.jobs;
        } catch (error) {
            console.error("Context: Failed to load schedule", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const acceptJobAssignment = async (bookingId) => {
        try {
            const response = await SweepstarApi.acceptJob(bookingId);
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("Context: Failed to accept job", error);
            const msg =
                error.response?.data?.message || "Failed to accept job.";
            return { success: false, message: msg };
        }
    };

    return (
        <BookingStateContext.Provider
            value={{
                bookings,
                loading,
                services, // Expose services list
                fetchServices, // Expose fetch function
                createBooking,
                fetchMyBookings,
                fetchAllBookings,
                editBooking,
                fetchAvailableJobs,
                fetchMySchedule,
                acceptJobAssignment,
            }}
        >
            {children}
        </BookingStateContext.Provider>
    );
}

export const useBooking = () => useContext(BookingStateContext);
