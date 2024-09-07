import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Groups from "./groups";
import Users from "./users";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Updated import

const Admin = () => {
  const [toggle, setToggle] = useState(false);
  const { user } = useAuth(); // Updated usage of the auth hook
  const Toggle = () => {
    setToggle(!toggle);
  };

  const [activePage, setActivePage] = useState("Dashboard"); // Default to Dashboard

  const selectPage = (page) => {
    setActivePage(page);
  };

  const authCheck = () => {
    if (user && user.role === "admin") { // Ensure the user object includes 'role'
      return (
        <div className="container-fluid bg-secondary min-vh-100">
          <div className="row">
            {toggle && (
              <div className="col-2 bg-white vh-100">
                <Sidebar selectPage={selectPage} />
              </div>
            )}
            <div className="col">
              {activePage === "Dashboard" && <Dashboard Toggle={Toggle} />}
              {activePage === "Groups" && <Groups Toggle={Toggle} />}
              {activePage === "Users" && <Users Toggle={Toggle} />}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>You are not authorized to access this page.</h1>
          <Link to="/login">Please login via this page.</Link>
        </div>
      );
    }
  };

  return (<>{authCheck()}</>);
};

export default Admin;
