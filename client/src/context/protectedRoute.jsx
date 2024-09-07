import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth(); // Get authentication status

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />; // Render children if authenticated, otherwise redirect to login
};

export default ProtectedRoute;