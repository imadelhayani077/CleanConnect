// src/router/index.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import MasterLayout from "@/layout/MasterLayout";
import RoleRoute from "./RoleRoute";

// Public pages
import Homepage from "../pages/homepage";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Contact from "../pages/contact";

// Shared dashboard shell
import MainDashboard from "@/pages/Dashboards/MainDashboard";
import NotFound from "../pages/notFound";

// Admin
import UsersList from "@/pages/Admin/UsersListe";
import BookingManager from "@/pages/Admin/BookingManager";
import ServiceManager from "@/pages/Admin/ServiceManager";
import ApplicationManager from "@/pages/Admin/ApplicationManager";

// General / shared
import UserInfo from "@/pages/GeneralPages/UserInfo";

// Client
import Booking from "@/pages/Client/Booking";
import AddressManager from "@/pages/Client/AddressManager";
import BookingHistory from "@/pages/Client/BookingHistory";
import SweepstarApply from "@/pages/Client/SweepstarApply";

// Sweepstar
import MySchedule from "../pages/Sweepstar/MySchedule";
import AvailableJobs from "@/pages/Sweepstar/AvailableJobs";

import { useUser } from "@/Hooks/useAuth";

// GuestOnly: redirect logged-in users away from login/signup
const GuestOnly = ({ children }) => {
    const { data: user, isLoading } = useUser();
    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    return user ? <Navigate to="/dashboard" replace /> : children;
};

export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <MasterLayout />,
        children: [
            // PUBLIC
            { path: "/", element: <Homepage /> },
            { path: "contact", element: <Contact /> },

            // GUEST ONLY
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

            // SHARED DASHBOARD ENTRY (any logged-in user)
            {
                element: <RoleRoute />, // just requires auth
                children: [
                    { path: "dashboard", element: <MainDashboard /> },
                    {
                        path: "dashboard/my_informations",
                        element: <UserInfo />,
                    },
                ],
            },

            // ADMIN ONLY ROUTES
            {
                element: <RoleRoute requiredRole="admin" />,
                children: [
                    { path: "dashboard/users_list", element: <UsersList /> },

                    {
                        path: "dashboard/bookings_list",
                        element: <BookingManager />,
                    },
                    { path: "dashboard/services", element: <ServiceManager /> },
                    {
                        path: "dashboard/sweepstar_requests",
                        element: <ApplicationManager />,
                    },
                ],
            },

            // CLIENT ONLY ROUTES
            {
                element: <RoleRoute requiredRole="client" />,
                children: [
                    { path: "dashboard/booking_service", element: <Booking /> },

                    {
                        path: "dashboard/bookings_history",
                        element: <BookingHistory />,
                    },
                    {
                        path: "dashboard/my_addresses",
                        element: <AddressManager />,
                    },
                    {
                        path: "dashboard/become_sweepstar",
                        element: <SweepstarApply />,
                    },
                ],
            },

            // SWEEPSTAR ONLY ROUTES
            {
                element: <RoleRoute requiredRole="sweepstar" />,
                children: [
                    {
                        path: "dashboard/available_opportunities",
                        element: <AvailableJobs />,
                    },
                    {
                        path: "dashboard/current_missions",
                        element: <MySchedule />,
                    },
                    {
                        path: "dashboard/missions_history",
                        element: <MySchedule />,
                    },
                ],
            },

            // 404
            { path: "*", element: <NotFound /> },
        ],
    },
]);
