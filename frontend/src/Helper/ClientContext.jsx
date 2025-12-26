import ClientApi from "@/Services/ClientApi";
import React, { createContext, useContext, useEffect, useState } from "react";

export const ClientStateContext = createContext({
    user: {},
    authenticated: false,
    loading: true,
    setUser: () => {},
    setAuthenticated: () => {},
    login: (values) => {},
    register: (values) => {},
    logout: () => {},
    isRole: (role) => {},
});

export default function ClientContext({ children }) {
    const [user, setUser] = useState({});
    const [authenticated, _setAuthenticated] = useState(
        () => window.localStorage.getItem("Authenticated") === "true"
    );
    const [loading, setLoading] = useState(true);

    const login = async (values) => {
        await ClientApi.getCsrfToken();
        return await ClientApi.login(values);
    };

    const logout = async () => {
        try {
            await ClientApi.logout();
        } catch (e) {
            console.error(e);
        }
        setUser({});
        _setAuthenticated(false);
        window.localStorage.removeItem("Authenticated");
    };

    const register = async (values) => {
        await ClientApi.getCsrfToken();
        return await ClientApi.register(values);
    };

    const setAuthenticated = (auth) => {
        _setAuthenticated(auth);
        window.localStorage.setItem("Authenticated", auth);
    };

    // --- FIX: THIS WAS MISSING ---
    const isRole = (role) => {
        return user?.role === role;
    };
    // -----------------------------

    useEffect(() => {
        const verifyUser = async () => {
            if (authenticated) {
                try {
                    setLoading(true);
                    const { data } = await ClientApi.getClient();
                    setUser(data);
                } catch (error) {
                    _setAuthenticated(false);
                    setUser({});
                    window.localStorage.removeItem("Authenticated");
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, [authenticated]);

    return (
        <ClientStateContext.Provider
            value={{
                user,
                setUser,
                authenticated,
                setAuthenticated,
                loading,
                login,
                logout,
                register,
                isRole, // Now this exists!
            }}
        >
            {children}
        </ClientStateContext.Provider>
    );
}

export const useClientContext = () => useContext(ClientStateContext);
