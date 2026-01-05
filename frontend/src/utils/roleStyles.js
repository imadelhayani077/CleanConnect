export const getRoleStyles = (role) => {
    switch (role) {
        case "admin":
            // Red
            return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-300/60";
        case "sweepstar":
            // Blue
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-300/60";
        case "client":
        default:
            // Green
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-300/60";
    }
};
