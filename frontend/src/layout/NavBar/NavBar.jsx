import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClientContext } from "@/Helper/ClientContext";
import ClientApi from "@/Services/ClientApi";
import { ModeButton } from "@/components/ui/Button-mode";

export default function NavBar() {
    const { authenticated, logout, user } = useClientContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await ClientApi.logout();
        } finally {
            logout();
            navigate("/login");
        }
    };

    // Helper to determine where the "Dashboard" button points
    const getDashboardRoute = () => {
        if (!user) return "/login";
        if (user.role === "admin") return "/admin/dashboard";
        if (user.role === "sweepstar") return "/sweepstar/dashboard"; // Corrected for Sweepstars
        return "/client/dashboard"; // Default for Clients
    };

    const NavItem = ({ to, children, onClick }) => {
        if (onClick) {
            return (
                <button onClick={onClick} className="navbar-link text-left">
                    <span className="relative">
                        {children}
                        <span className="navbar-link-underline"></span>
                    </span>
                </button>
            );
        }
        return (
            <Link to={to} className="navbar-link">
                <span className="relative">
                    {children}
                    <span className="navbar-link-underline"></span>
                </span>
            </Link>
        );
    };

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* 1. BRAND */}
                    <div className="flex items-center">
                        <Link to="/" className="navbar-brand">
                            CleanConnect
                        </Link>
                    </div>

                    {/* 2. DESKTOP LINKS */}
                    <div className="navbar-links items-center">
                        <NavItem to="/">Home Page</NavItem>
                        <NavItem to="/contact">Contact Us</NavItem>

                        {!authenticated ? (
                            <>
                                <NavItem to="/login">Login</NavItem>
                                <NavItem to="/signup">Sign Up</NavItem>
                            </>
                        ) : (
                            <>
                                {/* Dynamic Dashboard Link */}
                                <NavItem to={getDashboardRoute()}>
                                    Dashboard
                                </NavItem>
                                <NavItem onClick={handleLogout}>Logout</NavItem>
                            </>
                        )}
                    </div>

                    {/* 3. RIGHT SIDE ACTIONS */}
                    <div className="flex items-center space-x-4">
                        <ModeButton />
                        <button className="hamburger-button">
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
