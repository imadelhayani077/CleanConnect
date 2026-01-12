import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";
import AdminApi from "@/Services/AdminApi";
import SweepstarApi from "@/Services/SweepstarApi";

/*
    -------------------------------------------
    PART 1: DATA FETCHING HOOKS (GET Requests)
    -------------------------------------------
*/

// 1. Client: Get "My Bookings"
export const useMyBookings = () => {
    return useQuery({
        // We use a specific key so we don't mix up Client bookings with Admin bookings
        queryKey: ["bookings", "client"],
        queryFn: async () => {
            const response = await ClientApi.getMyBookings();
            return response.data.bookings || response.data;
        },
    });
};

// 2. Admin: Get "All Bookings"
export const useAllBookings = () => {
    return useQuery({
        queryKey: ["bookings", "admin"],
        queryFn: async () => {
            const response = await AdminApi.getAllBookings();
            console.log(response);
            return response.data.bookings || response.data;
        },
    });
};

// 3. Sweepstar: Get Available Jobs
export const useAvailableJobs = () => {
    return useQuery({
        queryKey: ["sweepstar", "jobs"],
        queryFn: async () => {
            const response = await SweepstarApi.getAvailableJobs();
            return response.data.jobs || [];
        },
    });
};

// 4. Sweepstar: Get My Schedule
export const useMySchedule = () => {
    return useQuery({
        queryKey: ["sweepstar", "schedule"],
        queryFn: async () => {
            const response = await SweepstarApi.getMySchedule();
            return response.data.jobs || [];
        },
    });
};
export const useCompleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookingId) => {
            return await SweepstarApi.completeJob(bookingId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sweepstar", "schedule"],
            });
            // Also invalidate history if needed
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

/*
    -------------------------------------------
    PART 2: ACTION HOOKS (Mutations)
    -------------------------------------------
*/

// 5. Client: Create a Booking
export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookingData) => {
            return await ClientApi.createBooking(bookingData);
        },
        onSuccess: () => {
            // When a client adds a booking, refresh their list
            queryClient.invalidateQueries({ queryKey: ["bookings", "client"] });
        },
        onError: (error) => {
            console.error("Hook: Create Booking Failed", error);
        },
    });
};

// 6. Shared: Edit/Update a Booking
export const useEditBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            // Note: mutationFn only accepts ONE argument, so we pass an object
            return await ClientApi.updateBooking(id, data);
        },
        onSuccess: () => {
            // Invalidate BOTH client and admin lists to be safe
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

// 7. Sweepstar: Accept a Job
export const useAcceptJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookingId) => {
            return await SweepstarApi.acceptJob(bookingId);
        },
        onSuccess: () => {
            // Complex invalidation:
            // 1. The job is no longer "available", so refresh available list
            queryClient.invalidateQueries({ queryKey: ["sweepstar", "jobs"] });
            // 2. The job is now in "my schedule", so refresh schedule
            queryClient.invalidateQueries({
                queryKey: ["sweepstar", "schedule"],
            });
        },
        onError: (error) => {
            console.error("Hook: Accept Job Failed", error);
        },
    });
};
export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            return await ClientApi.cancelBooking(id, reason);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};
