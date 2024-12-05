import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/auth.js';

// Checks if user is authenticated and has the required role
const ProtectedRoute = ({ element, role, ...rest }) => {
    const { authState } = useAuth();

    if (!authState.isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (role && authState.role !== role) {
        return <Navigate to="/" />;
    }

    return React.cloneElement(element, { ...rest });
};

export default ProtectedRoute;
