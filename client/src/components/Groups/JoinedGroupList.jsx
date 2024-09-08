import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGroups } from "../../slices/groupSlice";
import { fetchOneGroupInfo } from "../../slices/groupSlice";

const JoinedGroupList = () => {
	const dispatch = useDispatch();

	// Access user ID and groups from the Redux store
	const userId = useSelector((state) => state.auth.user?._id);
	const groups = useSelector((state) => state.groups.groups); // Access the groups array from state

	// Fetch unjoined groups when the component mounts or userId changes
	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await fetch("http://localhost:8000/group/joined", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json(); // Parse the response data
				dispatch(setGroups(data)); // Update Redux store with fetched groups
			} catch (err) {
				console.error("Failed to fetch groups:", err);
			}
		};

		if (userId) {
			fetchGroups();
		}
	}, [userId, dispatch]);

	// Handle requesting to join a group
	const handleViewGroup = async (groupId) => {
		try {
			const response = await fetch(`http://localhost:8000/group/${groupId}`, {
				method: "GET",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json(); // Parse the response data
			dispatch(fetchOneGroupInfo(data)); // Update Redux store with fetched groups
		} catch (err) {
			console.error("Failed to send join request:", err);
			alert("Error sending join request.");
		}

	};

	return (
		<div>
			<ul>
				{groups.map((group) => (
					<li key={group._id}>
						{group.name}
						<button onClick={() => handleViewGroup(group._id)}>
							View Group
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default JoinedGroupList;
