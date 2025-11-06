import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (username: string, email: string, pass: string) => Promise<void>;
    verify: (email: string, code: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserFromToken = useCallback(() => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                const user_data = api.verifyToken(token);
                if(user_data) {
                    setUser(user_data);
                } else {
                    localStorage.removeItem('jwt_token');
                }
            }
        } catch (error) {
            console.error("Failed to load user from token", error);
            localStorage.removeItem('jwt_token');
        } finally {
            setLoading(false);
        }
    },[]);

    useEffect(() => {
        loadUserFromToken();
    }, [loadUserFromToken]);

    const login = async (email: string, pass: string) => {
        const { user: loggedInUser, token } = await api.login(email, pass);
        localStorage.setItem('jwt_token', token);
        setUser(loggedInUser);
    };

    const signup = async (username: string, email: string, pass: string) => {
        await api.signup(username, email, pass);
        // Does not log in user, verification is the next step
    };
    
    const verify = async (email: string, code: string) => {
        const { user: verifiedUser, token } = await api.verifyEmail(email, code);
        localStorage.setItem('jwt_token', token);
        setUser(verifiedUser);
    }

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === Role.ADMIN,
            loading,
            login,
            signup,
            verify,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};