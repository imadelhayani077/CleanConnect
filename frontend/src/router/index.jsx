import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MasterLayout from "@/layout/MasterLayout";
import RoleRoute from "./RoleRoute"; // Ensure you created this from previous step

// Pages
import Homepage from "../pages/homepage";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Contact from "../pages/contact";
import ClientDashboard from "../pages/ClientDashboard";
import NotFound from "../pages/notFound";
import SweepstarDashboard from "@/pages/SweepstarDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

// Helper to redirect logged-in users away from Login page
const GuestOnly = ({ children }) => {
    const isAuth = window.localStorage.getItem("Authenticated") === "true";
    return isAuth ? <Navigate to="/client/dashboard" /> : children;
};

export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <MasterLayout />,
        children: [
            // --- PUBLIC ROUTES ---
            { path: "/", element: <Homepage /> },
            { path: "contact", element: <Contact /> },

            // --- GUEST ONLY (Login/Signup) ---
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

            // --- PROTECTED: CLIENT ---
            {
                element: <RoleRoute requiredRole="client" />,
                children: [
                    { path: "client/dashboard", element: <ClientDashboard /> },
                    // Add Booking page here later
                ],
            },
            {
                element: <RoleRoute requiredRole="sweepstar" />,
                children: [
                    {
                        path: "sweepstar/dashboard",
                        element: <SweepstarDashboard />,
                    },
                ],
            },

            // --- PROTECTED: ADMIN ---
            {
                element: <RoleRoute requiredRole="admin" />,
                children: [
                    { path: "admin/dashboard", element: <AdminDashboard /> },
                    // { path: "admin/users", element: <UsersList /> },
                ],
            },

            // --- 404 ---
            { path: "*", element: <NotFound /> },
        ],
    },
]);
