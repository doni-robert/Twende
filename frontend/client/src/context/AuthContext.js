import React, { useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access_token') || null);

    // Refresh token function
    const refreshToken = async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token) {
                throw new Error("No refresh token found.");
            }

            const response = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refresh_token }),
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.access);
                localStorage.setItem('access_token', data.access);
            } else {
                console.error('Failed to refresh token:', data);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    useEffect(() => {
        // Automatically refresh the token when the component mounts or when the token changes
        if (token) {
            const refreshInterval = setInterval(() => {
                refreshToken();
            }, 15 * 60 * 1000); // Refresh token every 15 minutes

            return () => clearInterval(refreshInterval); // Cleanup the interval on unmount
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;