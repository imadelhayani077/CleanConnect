/**
 * Avatar Helper Utilities
 * Centralized functions for avatar handling across the app
 */

export const AVATAR_SIZES = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
};

/**
 * Get avatar URL from user object
 * @param {Object} user - User object
 * @returns {string|null} Avatar URL or null
 */
export const getAvatarUrl = (user) => {
    if (!user) return null;
    return user?.avatar_url || user?.avatar || null;
};

/**
 * Get user initials from name
 * @param {string} name - User full name
 * @returns {string} 2-letter initials
 */
export const getInitials = (name) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Get CSS classes for a specific avatar size
 * @param {string} size - Size key (xs, sm, md, lg, xl)
 * @returns {string} Tailwind classes
 */
export const getAvatarSizeClass = (size = "md") => {
    return AVATAR_SIZES[size] || AVATAR_SIZES.md;
};

/**
 * Check if user has a custom avatar
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const hasCustomAvatar = (user) => {
    return !!getAvatarUrl(user);
};

/**
 * Get fallback gradient color based on user ID (for consistency)
 * @param {number|string} id - User ID
 * @returns {string} Gradient color class
 */
export const getAvatarGradient = (id) => {
    const colors = [
        "from-blue-100/60 to-blue-50/60 dark:from-blue-900/20 dark:to-blue-900/10",
        "from-purple-100/60 to-purple-50/60 dark:from-purple-900/20 dark:to-purple-900/10",
        "from-pink-100/60 to-pink-50/60 dark:from-pink-900/20 dark:to-pink-900/10",
        "from-amber-100/60 to-amber-50/60 dark:from-amber-900/20 dark:to-amber-900/10",
        "from-emerald-100/60 to-emerald-50/60 dark:from-emerald-900/20 dark:to-emerald-900/10",
    ];

    const index = id % colors.length || 0;
    return colors[index];
};
