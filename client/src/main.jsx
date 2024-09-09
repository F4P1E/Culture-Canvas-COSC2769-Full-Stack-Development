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
import PostFeed from "./components/Posts/PostFeed";
import NotFound from "./components/pages/NotFound";
import ProfilePage from "./components/pages/ProfilePage"; // Example ProfilePage import
import GroupPage from "./components/pages/GroupPage"; // Example GroupPage import
import PeoplePage from "./components/pages/PeoplePage";
import AuthProvider from "./context/authContext";
import ProtectedRoute from "./context/protectedRoute";
import UnjoinedGroupList from "./components/Groups/UnjoinedGroupList";
import GroupAdmin from "./components/Groups/GroupAdmin";
import FriendRequest from "./components/Friends/FriendRequest";
import PostHistory from "./components/Posts/PostHistory";
import CommentHistory from "./components/Posts/CommentHistory";
import AdminDashboard from "./components/Admin/dashboard";

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
				path: "/feed",
				element: <PostFeed />,
			},
			{
				path: "/profile",
				element: <ProfilePage />,
			},
			{
				path: "/group/:groupId",
				element: <GroupPage />,
			},
			{
				path: "/people",
				element: <PeoplePage />,
			},
			{
				path: "/friendRequest",
				element: <FriendRequest />,
			},
			{
				path: "/moregroups",
				element: <UnjoinedGroupList />,
			},
			{
				path: "/groupadmin",
				element: <GroupAdmin />,
			},
			{
				path: "/posthistory/:postId",
				element: <PostHistory/>,
			},
			{
				path: "/commenthistory/:commentId",
				element: <CommentHistory/>,
			},
			{
				path: "/admindashboard",
				element: <AdminDashboard/>,
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
