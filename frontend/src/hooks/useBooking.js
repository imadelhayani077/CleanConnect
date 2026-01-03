// src/hooks/useBookings.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClientApi from "@/Services/ClientApi";
import AdminApi from "@/Services/AdminApi";
import SweepstarApi from "@/Services/SweepstarApi";

/* ========= API functions ========= */

const fetchClientBookings = async () => {
    const res = await ClientApi.getMyBookings();
    return res.data.bookings || res.data;
};

const fetchAdminBookings = async () => {
    const res = await AdminApi.getAllBookings();
    return res.data.bookings || res.data;
};

const createBookingRequest = async (bookingData) => {
    const res = await ClientApi.createBooking(bookingData);
    return res.data.booking;
};

const editBookingRequest = async ({ id, updatedData }) => {
    const res = await ClientApi.updateBooking(id, updatedData);
    return res.data.booking;
};

const fetchAvailableJobsRequest = async () => {
    const res = await SweepstarApi.getAvailableJobs();
    return res.data.jobs || [];
};

const fetchMyScheduleRequest = async () => {
    const res = await SweepstarApi.getMySchedule();
    return res.data.jobs || [];
};

const acceptJobAssignmentRequest = async (bookingId) => {
    const res = await SweepstarApi.acceptJob(bookingId);
    return res.data;
};

/* ========= query hooks ========= */

// client/admin bookings
export const useBookings = ({ mode } = { mode: "client" }) => {
    const {
        data: bookings,
        isLoading,
        isError,
        error,
    } = mode === "admin"
        ? useQuery({
              queryKey: ["bookings", "admin"],
              queryFn: fetchAdminBookings,
          })
        : useQuery({
              queryKey: ["bookings", "client"],
              queryFn: fetchClientBookings,
          });

    return { bookings, isLoading, isError, error };
};

// available jobs for sweepstar
export const useAvailableJobs = () => {
    const {
        data: availableJobs,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["availableJobs"],
        queryFn: fetchAvailableJobsRequest,
    });

    return { availableJobs, isLoading, isError, error };
};

// sweepstar schedule
export const useSchedule = () => {
    const {
        data: mySchedule,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["mySchedule"],
        queryFn: fetchMyScheduleRequest,
    });

    return { mySchedule, isLoading, isError, error };
};

/* ========= mutation hooks ========= */

export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: createBooking,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: createBookingRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });

    return { createBooking, isLoading, isError, error };
};

export const useEditBooking = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: editBooking,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: editBookingRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });

    return { editBooking, isLoading, isError, error };
};

export const useAcceptJobAssignment = () => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: acceptJobAssignment,
        isLoading,
        isError,
        error,
    } = useMutation({
        mutationFn: acceptJobAssignmentRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
            queryClient.invalidateQueries({ queryKey: ["availableJobs"] });
        },
    });

    return { acceptJobAssignment, isLoading, isError, error };
};
