import React from "react";
import ReactDOM from "react-dom/client";

// React Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";  // Changed from storeConfig to direct destructuring
import { AuthProvider } from "./context/authContext";

// React Router
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Import components
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Admin from './Admin/Admin';  

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/admin",
        element: <Admin />,
        // Uncomment and customize the below line if admin page requires protection
        // element: <ProtectedRoute><Admin /></ProtectedRoute>,
    },
    // Redirect or handle other navigations
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {/* AuthProvider is optional, only include it if you have a custom context to provide */}
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
