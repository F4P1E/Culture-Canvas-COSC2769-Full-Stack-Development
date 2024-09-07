// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// React Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import storeConfig from "./store";

// React Router
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

// Import components
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import HomePage from "./components/pages/HomePage";
import NotFound from "./components/pages/NotFound";
import ProfilePage from "./components/pages/ProfilePage"; // Example ProfilePage import
import GroupPage from "./components/pages/GroupPage"; // Example GroupPage import
import PeoplePage from "./components/pages/PeoplePage";
import AuthProvider from "./context/authContext";
import ProtectedRoute from "./context/protectedRoute";
import UnjoinedGroupList from "./components/Groups/UnjoinedGroupList";
import GroupAdmin from "./components/Groups/GroupAdmin";

const { store, persistor } = storeConfig;

const HandleNavigation = () => {
	if (window.location.pathname === "/") {
		window.location.href = "/home";
		return null;
	}
	return null;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				path: "/home",
				element: <HomePage />,
			},
			{
				path: "/profile",
				element: <ProfilePage />,
			},
			{
				path: "/groups",
				element: <GroupPage />,
			},
			{
				path: "/people",
				element: <PeoplePage />,
			},
			{
				path: "/moregroups",
				element: <UnjoinedGroupList />,
			},
			{
				path: "/groupadmin",
				element: <GroupAdmin />,
			}
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AuthProvider>
					<RouterProvider router={router} />
					<HandleNavigation />
				</AuthProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
