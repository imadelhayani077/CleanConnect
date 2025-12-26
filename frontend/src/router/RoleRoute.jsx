import { useClientContext } from "@/Helper/ClientContext";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ requiredRole }) => {
    const { authenticated, user, isRole } = useClientContext();

    // 1. If not logged in, send to Login
    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    // 2. Wait until we actually have the user data (client.role)
    // If client object is empty, we show a simple loading state
    if (!user || !user.role) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 3. If logged in BUT wrong role, redirect to THEIR correct dashboard
    if (requiredRole && !isRole(requiredRole)) {
        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" />;
        }

        if (user.role === "sweepstar") {
            return <Navigate to="/sweepstar/dashboard" />; // Fixed Path
        }

        // Default fallback for clients
        return <Navigate to="/client/dashboard" />;
    }

    // 4. If all checks pass, show the page
    return <Outlet />;
};

export default RoleRoute;
