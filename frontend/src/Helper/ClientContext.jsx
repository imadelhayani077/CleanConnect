import ClientApi from "@/Services/ClientApi";
import React, { createContext, useContext, useEffect, useState } from "react";
export const ClientStateContext = createContext({
    client: {},
    authenticated: false,
    setAuthenticated: () => {},
    login: (values) => {},
    setClient: () => {},
    logout: () => {},
});
export default function ClientContext({ children }) {
    const [client, setClient] = useState({});
    const [authenticated, _setAuthenticated] = useState(() => {
        const stored = window.localStorage.getItem("Authenticated");
        return stored === "true"; // true only if exactly "true"
    });
    const login = async (values) => {
        await ClientApi.getCsrfToken();
        return await ClientApi.login(values);
    };
    const logout = () => {
        _setAuthenticated(false);
        setClient({});
        window.localStorage.removeItem("Authenticated");
    };

    const setAuthenticated = (isAuth) => {
        _setAuthenticated(isAuth);
        window.localStorage.setItem("Authenticated", isAuth);
    };
    return (
        <>
            <ClientStateContext.Provider
                value={{
                    client,
                    authenticated,
                    setAuthenticated,
                    setClient,
                    login,
                    logout,
                }}
            >
                {children}
            </ClientStateContext.Provider>
        </>
    );
}
export const useClientContext = () => useContext(ClientStateContext);
