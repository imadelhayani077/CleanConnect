import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Homepage from "../pages/homepage";
import Login from "../pages/login";
import ClientDashboard from "../pages/ClientDashboard";
import Contact from "../pages/contact";
import NotFound from "../pages/notFound";
import ClientLayout from "@/layout/ClientLayout";
import GuestLayout from "@/layout/GuestLayout";
import Signup from "../pages/signup";

export const AppRouter = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Homepage /> },
            { path: "/contact", element: <Contact /> },
            { path: "*", element: <NotFound /> },
        ],
    },
    {
        element: <ClientLayout />,
        children: [{ path: "/clientdashboard", element: <ClientDashboard /> }],
    },
    {
        element: <GuestLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
        ],
    },
]);
