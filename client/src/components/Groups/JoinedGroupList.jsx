import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGroups } from "../../slices/groupSlice";
import { useNavigate } from "react-router-dom";

const JoinedGroupList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
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

	// Handle redirection to view group
	const handleRedirectToViewGroup = (groupId) => {
		navigate(`/group/${groupId}`);
	};

	return (
		<div>
			<ul className="group-list">
				{groups.map((group) => (
					<li key={group._id}>
						<p className="group-name">{group.name}</p>
						&nbsp;&nbsp;
						<button onClick={() => handleRedirectToViewGroup(group._id)}>
							View Group
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default JoinedGroupList;
