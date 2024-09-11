import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGroup } from "../../slices/groupSlice"; // Import relevant Redux actions
import "../styles/GroupCreation.scss";

const GroupCreation = () => {
	const [groupName, setGroupName] = useState(""); // Local state for group name input
	const dispatch = useDispatch(); // Redux dispatcher
	const { loading, error } = useSelector((state) => state.groups); // Access Redux state

	const handleGroupCreation = async (e) => {
		e.preventDefault();

		if (!groupName) {
			return alert("Group name is required");
		}

		try {
			// Make the API request to create a group
			const response = await fetch("http://localhost:8000/group/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: groupName,
				}),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create group");
			}

			// Dispatch the addGroup action to add the new group to the Redux store
			dispatch(addGroup({ group: data.group }));

			// Reset the input fields
			setGroupName("");

			alert("Group creation request has been sent!");
		} catch (err) {
			console.error(err);
			console.log(err.message || "Failed to create group");
		}
	};

	return (
		<div className="group-creation-container">
			<h2>Create a New Group</h2>

			{loading && <p>Creating group...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}

			<form onSubmit={handleGroupCreation}>
				<div>
					<label htmlFor="groupName">Group Name:</label>
					<input
						type="text"
						id="groupName"
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
						required
					/>
				</div>

				<button type="submit" disabled={loading}>
					Create Group
				</button>
			</form>
		</div>
	);
};

export default GroupCreation;
