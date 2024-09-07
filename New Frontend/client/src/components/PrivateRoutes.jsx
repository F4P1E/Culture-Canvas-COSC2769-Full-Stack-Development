// Importing React components for navigation and routing, and Redux hook for accessing state.
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const user = useSelector((state) => state.auth.user); // Accessing user data from Redux store.

  // Conditional rendering: if user is authenticated, render child components; otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
