import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useClientContext } from "@/Helper/ClientContext";
import ClientApi from "@/Services/ClientApi";
import { GaugeIcon } from "lucide-react";
import SideBar from "./NavBar/SideBar";
import { ModeButton } from "@/components/ui/Button-mode";
import { ClientMenu } from "./NavBar/component/ClientMenu";

export default function ClientLayout() {
    const navigate = useNavigate();
    const { authenticated, client, logout, setClient } = useClientContext();

    // Only redirect if we know user is NOT authenticated
    useEffect(() => {
        if (authenticated) {
            const fetchUser = async () => {
                try {
                    const res = await ClientApi.getClient();
                    setClient(res.data);
                    // If you want to show name/email, update context here if needed
                } catch (error) {
                    console.log(
                        "Could not fetch user — session may be invalid"
                    );
                    // Don't auto-logout here unless you want strict check
                }
            };

            fetchUser();
        }
    }, [authenticated]);
    useEffect(() => {
        if (authenticated === false) {
            navigate("/login", { replace: true });
        }
    }, [authenticated, navigate]);

    const handleLogout = async () => {
        try {
            await ClientApi.logout(); // Try to clear session on server
        } catch (error) {
            // 401 is expected if session already gone — ignore it
            if (error.response?.status !== 401) {
                console.error("Unexpected logout error:", error);
            }
        } finally {
            // Always clear frontend state, no matter what server says
            logout(); // Clears authenticated + localStorage
            navigate("/login", { replace: true });
        }
    };

    return (
        <>
            <header>
                <nav className="fixed top-0 w-full py-4 px-6 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="text-2xl font-bold text-white">
                            CleanConnect
                        </div>

                        <div className="hidden md:flex space-x-8 items-center">
                            <Link
                                to="/clientdashboard"
                                className="text-gray-300 hover:text-white"
                            >
                                <GaugeIcon className="inline mb-1 mr-1" />
                                Dashboard
                            </Link>

                            <ClientMenu
                                userName={client.name}
                                onLogout={handleLogout}
                            />
                            <ModeButton />
                        </div>
                    </div>
                </nav>
            </header>

            <main className="min-h-screen pt-20">
                <div className="flex">
                    {/* Sidebar */}
                    <SideBar />

                    {/* Content */}
                    <div className="flex-1 px-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    );
}
