import React, { useEffect, useState } from "react";

function Users() {
	const [users, setUsers] = useState([]);

	// Fetch users from the backend
	useEffect(() => {
		fetch("http://localhost:8000/user", {
			credentials: "include",
		})
			.then((response) => response.json())
			.then((data) => {
				const usersArray = Array.isArray(data) ? data : [data];
				setUsers(usersArray);
			})
			.catch((error) => console.error("Failed to fetch users:", error));
	}, []);

	// Function to handle user deletion
	const deleteUser = (userId) => {
		fetch(`http://localhost:8000/user/${userId}`, {
			method: "DELETE",
			credentials: "include",
		})
			.then((response) => {
				if (response.ok) {
					setUsers(users.filter((user) => user._id !== userId));
				} else {
					alert("Failed to delete the user.");
				}
			})
			.catch((error) => console.error("Failed to delete user:", error));
	};

	return (
		<div>
			<h1>User List</h1>
			{users.map((user, index) => (
				<div key={user._id}>
					<span>{user.username}</span>
					<button onClick={() => deleteUser(user._id)}>Delete</button>
				</div>
			))}
		</div>
	);
}

export default Users;
