import { axiosClient } from "@/api/axios";

const SweepstarApi = {
    getAvailableMissions: async () => {
        return await axiosClient.get("/api/sweepstar/available-missions");
    },

    getMissionsHistory: async () => {
        return await axiosClient.get("/api/sweepstar/missions-history");
    },

    acceptMission: async (bookingId) => {
        return await axiosClient.post(`/api/bookings/${bookingId}/accept`);
    },
    // Add this function to the object
    completeMission: async (bookingId) => {
        return await axiosClient.post(`/api/bookings/${bookingId}/complete`);
    },
    toggleAvailability: async () => {
        return await axiosClient.post("/api/sweepstar/availability");
    },
};

export default SweepstarApi;
