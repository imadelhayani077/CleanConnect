import React, { createContext, useContext, useState, useEffect } from "react";
import ClientApi from "@/Services/ClientApi";

const BookingStateContext = createContext({
    bookings: {},
    loading: true,
    createBooking: (values) => {},
    fetchBookings: () => {},
    editBooking: (id, updatedData) => {},
});

export default function BookingContext({ children }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch all bookings (History & Upcoming)
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await ClientApi.getMyBookings();
            // Ensure we handle the response format correctly
            setBookings(response.data.bookings || response.data);
        } catch (error) {
            console.error("Context: Failed to load bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Load on mount
    useEffect(() => {
        fetchBookings();
    }, []);

    // 2. Create a Booking
    const createBooking = async (bookingData) => {
        try {
            const response = await ClientApi.createBooking(bookingData);
            const newBooking = response.data.booking; // Assuming backend returns the object

            // Add the new booking to the TOP of the list immediately
            setBookings([newBooking, ...bookings]);

            return { success: true };
        } catch (error) {
            console.error("Context: Create Booking Failed", error);
            return { success: false, error };
        }
    };

    const editBooking = async (id, updatedData) => {
        try {
            const response = await ClientApi.updateBooking(id, updatedData);
            const updatedBooking = response.data.booking;

            // Update the local list: Replace the old booking with the new one
            setBookings((prevBookings) =>
                prevBookings.map((b) => (b.id === id ? updatedBooking : b))
            );

            return { success: true };
        } catch (error) {
            console.error("Context: Update Booking Failed", error);
            // Return error message from backend if available
            const msg = error.response?.data?.message || "Update failed";
            return { success: false, error: msg };
        }
    };

    return (
        <BookingStateContext.Provider
            value={{
                bookings,
                loading,
                createBooking,
                fetchBookings,
                editBooking,
            }}
        >
            {children}
        </BookingStateContext.Provider>
    );
}

export const useBooking = () => useContext(BookingStateContext);
