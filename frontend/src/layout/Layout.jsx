import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
                <nav className="navbar">
                    <div className="navbar-container">
                        <div className="flex items-center">
                            <span className="navbar-brand text-gradient">
                                CleanConnect
                            </span>
                        </div>

                        <div className="navbar-links">
                            <Link to={"/"} className="navbar-link">
                                <span className="relative">
                                    Home Page
                                    <span className="navbar-link-underline"></span>
                                </span>
                            </Link>

                            <Link to={"/contact"} className="navbar-link">
                                <span className="relative">
                                    Contact Us
                                    <span className="navbar-link-underline"></span>
                                </span>
                            </Link>

                            <Link to={"/login"} className="navbar-link">
                                <span className="relative">
                                    Login
                                    <span className="navbar-link-underline"></span>
                                </span>
                            </Link>

                            <Link to={"/signup"} className="navbar-link">
                                <span className="relative">
                                    Sign Up
                                    <span className="navbar-link-underline"></span>
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="hidden md:block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                <i className="fas fa-moon"></i>
                            </button>
                            <button className="hamburger-button">
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container min-h-screen">
                <Outlet />
            </main>
        </>
    );
}
