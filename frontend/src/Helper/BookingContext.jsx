import React, { createContext, useContext, useState, useCallback } from "react";
import ClientApi from "@/Services/ClientApi";
import AdminApi from "@/Services/AdminApi";
import SweepstarApi from "@/Services/SweepstarApi";

const BookingStateContext = createContext();

export default function BookingContext({ children }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- CLIENT: Fetch My Bookings ---
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

    // --- ADMIN: Fetch All Bookings ---
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

    // --- CLIENT: Create Booking ---
    const createBooking = async (bookingData) => {
        setLoading(true);
        try {
            const response = await ClientApi.createBooking(bookingData);
            const newBooking = response.data.booking;

            // Update UI immediately
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

    // --- SHARED: Edit Booking ---
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
            return { success: false, error: error.message };
        }
    };

    // --- SWEEPSTAR FUNCTIONS ---
    const fetchAvailableJobs = async () => {
        setLoading(true);
        try {
            const response = await SweepstarApi.getAvailableJobs();
            return response.data.jobs || [];
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
            return response.data.jobs || [];
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
                fetchMyBookings,
                fetchAllBookings,
                createBooking,
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
