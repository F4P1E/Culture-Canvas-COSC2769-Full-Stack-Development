import React from "react";

const ProtectedRoute = ({ children }) => {
	const { currentUser } = useContext(AuthContext);

	// If not logged in, redirect to login
	if (
		!currentUser &&
		window.location.pathname !== "/login" &&
		window.location.pathname !== "/register"
	) {
		return <Navigate to="/login" />;
	}

	// If user is logged in and tries to access the root, redirect to home
	if (currentUser && window.location.pathname === "/") {
		return <Navigate to="/home" />;
	}

	return children;
};

export default ProtectedRoute;