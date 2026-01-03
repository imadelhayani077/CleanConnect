// src/layout/NavBar/NavBar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, X } from "lucide-react";
import { ModeButton } from "@/components/ui/Button-mode";
import { useUser, useLogout } from "@/Hooks/useAuth";

export default function NavBar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const { data: user, isLoading } = useUser();
    const { mutateAsync: logoutUser } = useLogout();

    const handleLogout = async () => {
        try {
            await logoutUser();
            setIsOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    const getDashboardRoute = () => {
        if (!user) return "/login";
        return user.role ? "/dashboard" : "/";
    };

    const NavItem = ({ to, children, onClick, className = "" }) => {
        const handleClick = () => {
            if (onClick) onClick();
            closeMenu();
        };

        if (onClick) {
            return (
                <button
                    onClick={handleClick}
                    className={`navbar-link text-left ${className}`}
                >
                    <span className="relative">
                        {children}
                        <span className="navbar-link-underline" />
                    </span>
                </button>
            );
        }

        return (
            <Link
                to={to}
                onClick={handleClick}
                className={`navbar-link ${className}`}
            >
                <span className="relative">
                    {children}
                    <span className="navbar-link-underline" />
                </span>
            </Link>
        );
    };

    return (
        <header className="relative z-50">
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Brand */}
                    <Link to="/" className="navbar-brand" onClick={closeMenu}>
                        Clean<span className="text-primary">Nest</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Left side links */}
                        <div className="navbar-links">
                            <NavItem to="/">Home</NavItem>
                            <NavItem to="/contact">Contact</NavItem>
                        </div>

                        {/* Auth links + toggle on the far right */}
                        <div className="flex items-center gap-4">
                            {isLoading ? (
                                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : !user ? (
                                <>
                                    <NavItem
                                        to="/login"
                                        className="font-medium"
                                    >
                                        Login
                                    </NavItem>
                                    <NavItem
                                        to="/signup"
                                        className="font-medium"
                                    >
                                        Sign Up
                                    </NavItem>
                                </>
                            ) : (
                                <>
                                    <NavItem
                                        to={getDashboardRoute()}
                                        className="font-medium"
                                    >
                                        {user.role} Dashboard
                                    </NavItem>
                                    <NavItem
                                        onClick={handleLogout}
                                        className="font-medium"
                                    >
                                        Logout
                                    </NavItem>
                                </>
                            )}

                            {/* Theme toggle LAST on desktop */}
                            <ModeButton />
                        </div>
                    </div>

                    {/* Mobile: right side (theme + hamburger) */}
                    <div className="flex items-center gap-3 md:hidden">
                        <ModeButton />

                        <button
                            className="hamburger-button"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6 text-[color:var(--hamburger-line)]" />
                            ) : (
                                <>
                                    <span className="hamburger-line" />
                                    <span className="hamburger-line" />
                                    <span className="hamburger-line" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {/* Mobile dropdown */}
                {isOpen && (
                    <div className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg md:hidden flex flex-col p-4 gap-4 animate-in slide-in-from-top-5">
                        <NavItem to="/" className="text-foreground">
                            Home Page
                        </NavItem>
                        <NavItem to="/contact" className="text-foreground">
                            Contact Us
                        </NavItem>

                        {isLoading ? (
                            <div className="py-2 flex justify-center text-foreground">
                                <Loader className="animate-spin" />
                            </div>
                        ) : !user ? (
                            <>
                                <NavItem
                                    to="/login"
                                    className="text-foreground"
                                >
                                    Login
                                </NavItem>
                                <NavItem
                                    to="/signup"
                                    className="text-foreground"
                                >
                                    Sign Up
                                </NavItem>
                            </>
                        ) : (
                            <>
                                <NavItem
                                    to={getDashboardRoute()}
                                    className="text-foreground"
                                >
                                    {user.role} Dashboard
                                </NavItem>
                                <NavItem
                                    onClick={handleLogout}
                                    className="text-foreground"
                                >
                                    Logout
                                </NavItem>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
