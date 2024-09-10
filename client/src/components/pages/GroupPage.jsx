// Importing React hooks for state and effect, routing hook, and Redux hook for accessing state.
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOneGroupInfo } from "../../slices/groupSlice";

import PostFeed from "../Posts/PostFeed";
import CreatePost from "../Posts/CreatePost";

const GroupPage = () => {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const { groupInfo, memberInfo } = useSelector((state) => state.groups);
	const userId = useSelector((state) => state.auth.user._id);
	// const memberInfo = useSelector((state) => state.groups.memberInfo);

	console.log(`Group ID: ${groupId}`);

	// useEffect to fetch group data when the component mounts or ID/token changes.
	useEffect(() => {
		const fetchOneGroup = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/group/specific/${groupId}`,
					{
						method: "GET",
						headers: { "Populate-Member": "true" },
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();

				// Check if data has the expected structure
				if (data && data.members && Array.isArray(data.members)) {
					dispatch(fetchOneGroupInfo(data));
				} else {
					console.error("Unexpected data structure:", data);
				}
			} catch (err) {
				console.error("Failed to fetch group data:", err);
			}
		};

		fetchOneGroup();
	}, [groupId, dispatch]);

	// Render the group page with group details, admin actions, and posts.
	return (
		<div>
			<h1>{groupInfo.name || "Loading..."}</h1>
			<h2>Members</h2>
			<ul>
				{groupInfo.members && groupInfo.members.length > 0 ? (
					groupInfo.members.map((member) => (
						<li key={member._id}>
							<p>{member.username}</p>{" "}
						</li>
					))
				) : (
					<li>No members found</li>
				)}
			</ul>

			<h2>Post something...</h2>
			<CreatePost groupId={groupId} />
			<PostFeed groupId={groupId} />
			{/* Render PostFeed with group's posts. */}
		</div>
	);
};
export default GroupPage;
