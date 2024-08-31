// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React Redux
import { Provider } from 'react-redux';
import store from './store';

// React Router
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Import components
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import HomePage from './components/pages/HomePage';
import NotFound from './components/pages/NotFound';
import ProfilePage from './components/pages/ProfilePage'; // Example ProfilePage import
import GroupPage from './components/pages/GroupPage'; // Example GroupPage import

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />, // Redirect root to login
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
