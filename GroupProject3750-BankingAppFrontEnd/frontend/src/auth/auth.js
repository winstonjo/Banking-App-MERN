import React, { createContext, useContext, useState, useEffect } from 'react';


// Create a context for authentication
const AuthContext = createContext();

// Provider component wraps app and provides auth context
export const AuthProvider = ({ children }) => {
    // Initial state
    const [authState, setAuthState] = useState({ isAuthenticated: false, role: null });

    // Fetch auth state from the backend
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:4000/record/auth-check', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setAuthState({ isAuthenticated: true, role: data.role });
                }
                else {
                    setAuthState({ isAuthenticated: false, role: null });
                }
            } catch (error) {
                console.error('Failed to fetch auth status:', error);
                setAuthState({ isAuthenticated: false, role: null });
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

// Accessing auth context
export const useAuth = () => {
    return useContext(AuthContext);
};