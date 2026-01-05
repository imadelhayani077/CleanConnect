import { axiosClient } from "@/api/axios";

const SweepstarApi = {
    getAvailableJobs: async () => {
        return await axiosClient.get("/api/sweepstar/available-jobs");
    },

    getMySchedule: async () => {
        return await axiosClient.get("/api/sweepstar/my-schedule");
    },

    acceptJob: async (bookingId) => {
        return await axiosClient.post(`/api/bookings/${bookingId}/accept`);
    },
    // Add this function to the object
    completeJob: async (bookingId) => {
        return await axiosClient.post(`/api/bookings/${bookingId}/complete`);
    },
};

export default SweepstarApi;
