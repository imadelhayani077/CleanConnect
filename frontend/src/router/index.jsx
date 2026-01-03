import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MasterLayout from "@/layout/MasterLayout";
import RoleRoute from "./RoleRoute";

// Pages
import Homepage from "../pages/homepage";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Contact from "../pages/contact";
import MainDashboard from "@/pages/Dashboards/MainDashboard";
import NotFound from "../pages/notFound";
import UsersList from "@/pages/Admin/UsersListe";
import MySchedule from "../pages/Sweepstar/MySchedule"; // Assuming you have this now
import { useUser } from "@/Hooks/useAuth";

// --- Guest Only Guard ---
// Redirects to Dashboard if "Authenticated" is found in storage.
const GuestOnly = ({ children }) => {
    const { data: user, isLoading } = useUser();
    if (isLoading) return null;
    return user ? <Navigate to="/dashboard" replace /> : children;
};

export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <MasterLayout />,
        children: [
            // ==========================================
            // PUBLIC ROUTES
            // ==========================================
            { path: "/", element: <Homepage /> },
            { path: "contact", element: <Contact /> },

            // ==========================================
            // GUEST ONLY (Login/Signup)
            // ==========================================
            {
                path: "login",
                element: (
                    <GuestOnly>
                        <Login />
                    </GuestOnly>
                ),
            },
            {
                path: "signup",
                element: (
                    <GuestOnly>
                        <Signup />
                    </GuestOnly>
                ),
            },

            // ==========================================
            // PROTECTED: SHARED DASHBOARD
            // ==========================================
            {
                // No 'requiredRole' = Accessible by any logged-in user
                element: <RoleRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <MainDashboard />,
                    },
                ],
            },

            // ==========================================
            // PROTECTED: ADMIN ONLY
            // ==========================================
            {
                element: <RoleRoute requiredRole="admin" />,
                children: [{ path: "admin/users", element: <UsersList /> }],
            },

            // ==========================================
            // PROTECTED: CLIENT ONLY
            // ==========================================
            {
                element: <RoleRoute requiredRole="client" />,
                children: [
                    // { path: "my-bookings", element: <MyBookings /> },
                ],
            },

            // ==========================================
            // PROTECTED: SWEEPSTAR ONLY
            // ==========================================
            {
                element: <RoleRoute requiredRole="sweepstar" />,
                children: [{ path: "schedule", element: <MySchedule /> }],
            },

            // ==========================================
            // 404 FALLBACK
            // ==========================================
            { path: "*", element: <NotFound /> },
        ],
    },
]);
