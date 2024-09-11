import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "./sidebar";
import AdminDashboard from "./dashboard";
import Groups from "./groups";
import Users from "./users";
import Posts from "./posts";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Admin = () => {
	const [toggle, setToggle] = useState(true);
	const { user } = useAuth();
	const Toggle = () => {
		setToggle(!toggle);
	};

	const [activePage, setActivePage] = useState("Dashboard");

	const selectPage = (page) => {
		setActivePage(page);
	};

	const authCheck = () => {
		if (user && user.admin === true) {
			return (
				<div className="container-fluid min-vh-100">
					<div className="row">
						{toggle && (
							<div className="col-3 bg-white vh-100">
								<Sidebar selectPage={selectPage} />
							</div>
						)}
						<div className="col">
							{activePage === "Dashboard" && <AdminDashboard Toggle={Toggle} />}
							{activePage === "Groups" && <Groups Toggle={Toggle} />}
							{activePage === "Users" && <Users Toggle={Toggle} />}
							{activePage === "Posts" && <Posts Toggle={Toggle} />}
							<button className="button" onClick={Toggle}>
								Sidebar
							</button>
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

	return <>{authCheck()}</>;
};

export default Admin;
