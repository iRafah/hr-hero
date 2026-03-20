import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            getCurrentUser()
                .then(setUser)
                .catch(() => localStorage.removeItem("access_token"))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (userData, accessToken) => {
        localStorage.setItem("access_token", accessToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
