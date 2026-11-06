import { Children, createContext, useContext, useState } from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('hotelUser');
        return savedUser ? JSON.parse(savedUser) : null
    })

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        if (!data.token || !data.user) {
            throw new Error('Invalid login response from the server');
        }

        const allowedRoles = ['admin', 'receptionist'];

        if (!allowedRoles.includes(data.user.role)) {
            throw new Error('You are not authorized to access the admin panel.');
        }

        localStorage.setItem('hotelToken', data.token);
        localStorage.setItem('hotelUser', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('hotelToken');
        localStorage.removeItem('hotelUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
};