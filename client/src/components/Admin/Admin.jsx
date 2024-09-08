import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Groups from "./groups";
import Users from "./users";
import Posts from "./posts";
import { useAuth } from "../../context/authContext"; // Make sure this path is correct

const Admin = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const { user } = useAuth(); // Ensure you have a hook or context providing user and auth state
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality here
    // localStorage.removeItem('token'); // Example: Clear stored auth token
    navigate('/login'); // Redirect to login after logout
  };

  // Sidebar content change handler
  const selectPage = (page) => {
    if (page === "Logout") {
      handleLogout();
    } else {
      setActivePage(page);
    }
  };

  // Conditional rendering based on user role and authentication state
  const renderContent = () => {
    if (!user || !user.admin) {
      return (
        <div>
          <h1>You are not authorized to access this page.</h1>
          <Link to="/login">Please login via this page.</Link>
        </div>
      );
    }
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Groups":
        return <Groups />;
      case "Users":
        return <Users />;
      case "Posts":
        return <Posts />;
      default:
        return <Dashboard />; // Fallback to Dashboard
    }
  };

  return (
    <div className="container-fluid bg-secondary min-vh-50">
      <div className="row">
        <div className="col-2 bg-white">
          <Sidebar selectPage={selectPage} />
        </div>
        <div className="col-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
