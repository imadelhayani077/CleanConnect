export const NotificationHandlers = {
    newUser: (navigate, data) => {
        navigate("/dashboard/users", {
            state: { openUserId: data.user_id },
        });
    },
    profileUpdate: (navigate, data) => {
        navigate("/dashboard/users", {
            state: { openUserId: data.user_id },
        });
    },

    booking_accepted: (navigate) => {
        navigate("/dashboard/bookings_history");
    },
    booking_completed: (navigate, data) => {
        navigate("/dashboard/bookings_history", {
            state: { openBooking: data.booking },
        });
    },
    new_booking: (navigate) => {
        navigate("/dashboard/available_missions");
    },
    review: (navigate) => {
        navigate("/dashboard/bookings");
    },
    applicationRequest: (navigate) => {
        navigate("/dashboard/applications");
    },
};
