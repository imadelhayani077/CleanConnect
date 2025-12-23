import axios from "axios";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
    withCredentials: true, // 👈 REQUIRED
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});
axiosClient.defaults.withXSRFToken = true;
