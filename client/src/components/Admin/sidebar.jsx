import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../admin/admin.css";
import { useAuth } from "../../context/authContext";

function Sidebar({ selectPage }) {
	const navigate = useNavigate();
	const [activeItem, setActiveItem] = useState("Dashboard");

	const handleLogout = async () => {
		try {
			const response = await fetch("http://localhost:8000/logout", {
				method: "GET",
				credentials: "include", // Include credentials in the request
			});

			if (response.ok) {
				navigate("/login");
			} else {
				console.error("Logout failed");
			}
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	const handleSelectPage = (page) => {
		if (page === "Logout") {
			handleLogout(); // Call handleLogout when "Logout" is selected
		} else {
			selectPage(page);
			setActiveItem(page); // Set active item state
			navigate(`/${page.toLowerCase()}`); // Navigate to the selected page
		}
	};

	return (
		<div className="bg-white sidebar p-2">
			<div className="m-2">
				<i className="bi bi-bootstrap-fill me-3 fs-4"></i>
				<span className="brand-name fs-4">AdminPanel</span>
			</div>
			<hr className="text-dark" />
			<div className="list-group list-group-flush">
				<button
					onClick={() => handleSelectPage("Dashboard")}
					className={`list-group-item py-2 ${
						activeItem === "Dashboard" ? "active" : ""
					}`}
				>
					<i className="bi bi-speedometer2 fs-5 me-3"></i>
					<span className="fs-5">Dashboard</span>
				</button>
				<button
					onClick={() => handleSelectPage("Groups")}
					className={`list-group-item py-2 ${
						activeItem === "Groups" ? "active" : ""
					}`}
				>
					<i className="bi bi-people fs-5 me-3"></i>
					<span className="fs-5">Groups</span>
				</button>
				<button
					onClick={() => handleSelectPage("Users")}
					className={`list-group-item py-2 ${
						activeItem === "Users" ? "active" : ""
					}`}
				>
					<i className="bi bi-person-check fs-5 me-3"></i>
					<span className="fs-5">Users</span>
				</button>
				<button
					onClick={() => handleSelectPage("Posts")}
					className={`list-group-item py-2 ${
						activeItem === "Users" ? "active" : ""
					}`}
				>
					<i className="bi bi-person-check fs-5 me-3"></i>
					<span className="fs-5">Posts</span>
				</button>
				{/* Add Group Creation Requests button */}
				<button
					onClick={() => handleSelectPage("GroupCreationRequests")}
					className={`list-group-item py-2 ${
						activeItem === "GroupCreationRequests" ? "active" : ""
					}`}
				>
					<i className="bi bi-clipboard-plus fs-5 me-3"></i>
					<span className="fs-5">Group Creation Requests</span>
				</button>
				<button
					onClick={() => handleSelectPage("Logout")}
					className={`list-group-item py-2 ${
						activeItem === "Logout" ? "active" : ""
					}`}
				>
					<i className="bi bi-box-arrow-right fs-5 me-3"></i>
					<span className="fs-5">Logout</span>
				</button>
			</div>
		</div>
	);
}

export default Sidebar;
