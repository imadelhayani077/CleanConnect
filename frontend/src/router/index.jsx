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

// Helper to redirect logged-in users away from Login page
const GuestOnly = ({ children }) => {
    const isAuth = window.localStorage.getItem("Authenticated") === "true";
    return isAuth ? <Navigate to="/dashboard" /> : children;
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

            // --- PROTECTED: SHARED DASHBOARD (ALL ROLES) ---
            // We use RoleRoute without 'requiredRole' just to check if they are logged in.
            {
                element: <RoleRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <MainDashboard />, // <--- MainDashboard handles the role switching
                    },
                ],
            },

            // --- PROTECTED: SPECIFIC ADMIN PAGES ---
            // Only put pages here that ONLY admins can see (e.g. /admin/users)
            {
                element: <RoleRoute requiredRole="admin" />,
                children: [
                    { path: "admin/users", element: <UsersList /> },
                    // { path: "admin/settings", element: <AdminSettings /> },
                ],
            },

            // --- PROTECTED: SPECIFIC CLIENT PAGES ---
            {
                element: <RoleRoute requiredRole="client" />,
                children: [
                    // { path: "my-bookings", element: <MyBookings /> },
                ],
            },

            // --- 404 ---
            { path: "*", element: <NotFound /> },
        ],
    },
]);
