// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// React Redux
import { Provider } from "react-redux";
import store from "./store";

// React Router
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";

// Import components
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import HomePage from "./components/pages/HomePage";
import NotFound from "./components/pages/NotFound";
import ProfilePage from "./components/pages/ProfilePage"; // Example ProfilePage import
import GroupPage from "./components/pages/GroupPage"; // Example GroupPage import
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import "./style.scss";
import { useContext, useEffect, useState } from "react";

import {
	DarkModeContext,
	DarkModeContextProvider,
} from "./context/darkModeContext";
import { AuthContext, AuthContextProvider } from "./context/authContext";

const Layout = () => {
	const { darkMode } = useContext(DarkModeContext);

	return (
		<div className={`theme-${darkMode ? "dark" : "light"}`}>
			<Navbar />
			<div style={{ display: "flex" }}>
				<LeftBar />
				<div style={{ flex: 6 }}>
					<Outlet />
				</div>
				<RightBar />
			</div>
		</div>
	);
};

const ProtectedRoute = ({ children }) => {
	const { currentUser } = useContext(AuthContext);
	const location = useLocation();
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (currentUser && location.pathname === "/") {
			setRedirect(true);
		}
	}, [currentUser, location]);

	if (redirect) {
		return <Navigate to="/home" />;
	}

	if (!currentUser && location.pathname !== "/login") {
		return <Navigate to="/login" />;
	}

	return children;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<Layout />
			</ProtectedRoute>
		),
		children: [
			{
				path: "/home",
				element: <HomePage />,
			},
			{
				path: "/profile/:id",
				element: <ProfilePage />,
			},
		],
		errorElement: <NotFound />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/groups",
		element: <GroupPage />,
	},
]);

const App = () => {
	const { darkMode } = useContext(DarkModeContext);
	const { currentUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Set loading to false after initial load
		if (currentUser !== undefined) {
			setLoading(false);
		}
	}, [currentUser]);

	if (loading) {
		return <div>Loading...</div>; // Replace with a spinner or similar if preferred
	}

	return (
		<div className={darkMode ? "dark" : ""}>
			<RouterProvider router={router} />
		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<DarkModeContextProvider>
				<AuthContextProvider>
					<App />
				</AuthContextProvider>
			</DarkModeContextProvider>
		</Provider>
	</React.StrictMode>
);
