import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

export default function Layout() {
    return (
        <>
            <header>
                <>
                    <nav className=" top-0 left-0 w-full py-4 px-6 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="text-2xl text-gray-100 hover:text-white font-bold text-gradient">
                                    CleanConnect
                                </span>
                            </div>

                            <div className="hidden md:flex space-x-8">
                                <Link
                                    to={"/"}
                                    className="relative group text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <span className="relative">
                                        Home Page
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </Link>

                                <Link
                                    to={"/contact"}
                                    className="relative group text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <span className="relative">
                                        Contact Us
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </Link>
                                <Link
                                    to={"/login"}
                                    className="relative group text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <span className="relative">
                                        Login
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </Link>
                                <Link
                                    to={"/signup"}
                                    className="relative group text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <span className="relative">
                                        Sign Up
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </Link>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button className="hidden md:block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    <i className="fas fa-moon"></i>
                                </button>
                                <button className="md:hidden flex flex-col space-y-1.5">
                                    <span className="w-6 h-0.5 bg-gray-300"></span>
                                    <span className="w-6 h-0.5 bg-gray-300"></span>
                                    <span className="w-6 h-0.5 bg-gray-300"></span>
                                </button>
                            </div>
                        </div>
                    </nav>
                </>
            </header>
            <main className=" container min-h-screen">
                <Outlet />
            </main>
        </>
    );
}
