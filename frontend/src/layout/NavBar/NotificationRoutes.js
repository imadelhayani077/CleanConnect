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

    booking: (navigate) => {
        navigate("/dashboard/bookings");
    },
    review: (navigate) => {
        navigate("/dashboard/bookings");
    },
    applicationRequest: (navigate) => {
        navigate("/dashboard/applications");
    },
};
