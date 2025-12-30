import React from "react";
import BookingHistory from "../Client/BookingHistory";
import Booking from "../Client/Booking";
import UserInfo from "@/layout/NavBar/component/UserInfo";
import { useClientContext } from "@/Helper/ClientContext";
import AddressManager from "../Client/AddressManager";

export default function ClientDashboard({ activePage }) {
    const { user } = useClientContext();
    const HnadelContent = () => {
        switch (activePage) {
            case "book-new":
                return (
                    <Booking
                        onSuccess={() =>
                            (window.location.href =
                                "/dashboard?tab=my-bookings")
                        }
                    />
                );
            case "my-bookings":
                return <BookingHistory />;
            case "addresses":
                return <AddressManager />;
            case "my-info":
                return <UserInfo />;
            case "dashboard":
            default:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-primary/10 p-8 rounded-2xl border border-primary/20">
                            <h1 className="text-3xl font-bold text-foreground">
                                Hello, {user.name}! 👋
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Ready to make your home shine? Book a
                                professional cleaner in seconds.
                            </p>
                            <button className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                Book a Cleaning Now
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                                <h3 className="font-semibold text-lg text-foreground">
                                    Active Booking
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    You have no upcoming bookings.
                                </p>
                            </div>
                            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                                <h3 className="font-semibold text-lg text-foreground">
                                    Your Addresses
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    1 Saved Address
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };
    return <>{HnadelContent()}</>;
}
