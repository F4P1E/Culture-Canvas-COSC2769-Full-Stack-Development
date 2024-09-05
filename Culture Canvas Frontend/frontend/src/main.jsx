// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// React Redux
import { Provider } from "react-redux";
import store from "./store";

// React Router
import {
	createBrowserRouter,
	RouterProvider,
    Outlet,
	Navigate,
} from "react-router-dom";

// Import components
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import NotFound from "./components/pages/NotFound";
import GroupPage from "./components/pages/GroupPage"; // Example GroupPage import
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";

const {currentUser} = useContext(AuthContext);

const { darkMode } = useContext(DarkModeContext);

const Layout = () => {
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
    if (!currentUser) {
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
              path: "/",
              element: <Home />,
            },
            {
              path: "/profile/:id",
              element: <Profile />,
            },
          ],
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
);