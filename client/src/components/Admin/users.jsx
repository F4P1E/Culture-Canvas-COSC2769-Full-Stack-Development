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
	const toggleSuspendUser = async (userId) => {
		const response = await fetch(`http://localhost:8000/suspend/${userId}`, {
			method: "PATCH",
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to suspend user. Please try again later.");
		}

		try {
			const data = await response.json();

			if (data.message == "User suspended successfully") {
				alert("User suspended successfully");
				window.location.reload();
			} else {
				alert("User resumed successfully");
				window.location.reload();
			}
		} catch (error) {
			console.error("Failed to suspend user:", error);
		}
	};

	return (
		<div>
			<h1>User List</h1>
			{users.map((user, index) => (
				<div key={user._id}>
					<span>{user.username}</span>
					{user.suspended ? (
						<button onClick={() => toggleSuspendUser(user._id)}>Resume</button>
					) : (
						<button onClick={() => toggleSuspendUser(user._id)}>Suspend</button>
					)}
				</div>
			))}
		</div>
	);
}
export default Users;
