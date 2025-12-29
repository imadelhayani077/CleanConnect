import React from "react";
import BookingHistory from "../Client/BookingHistory";
import Booking from "../Client/Booking";
import UserInfo from "@/layout/NavBar/component/UserInfo";

export default function ClientDashboard({ activePage }) {
    const HnadelContent = () => {
        switch (activePage) {
            case "book-new":
                return <Booking />;
            case "my-bookings":
                return <BookingHistory />;
            case "dashboard":
            default:
                return <UserInfo />;
        }
    };
    return <>{HnadelContent()}</>;
}
