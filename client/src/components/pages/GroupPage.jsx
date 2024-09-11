// SCSS
import "../styles/GroupPage.scss";

// Importing React hooks for state and effect, routing hook, and Redux hook for accessing state.
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOneGroupInfo, setRequests } from "../../slices/groupSlice";

import PostFeed from "../Posts/PostFeed";
import CreatePost from "../Posts/CreatePost";

const GroupPage = () => {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const { groupInfo, memberInfo, requests } = useSelector(
		(state) => state.groups
	);
	const userId = useSelector((state) => state.auth.user._id);

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

	useEffect(() => {
		const fetchGroupRequest = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/group/requests/${groupId}`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				dispatch(setRequests(data));
			} catch (err) {
				console.error("Failed to fetch group data:", err);
			}
		};

		fetchGroupRequest();
	}, [groupId, dispatch]);

	const handleAcceptRequest = async (requestId) => {
		try {
			const response = await fetch(
				`http://localhost:8000/group/approve/${groupId}/${requestId}`,
				{
					method: "POST",
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			alert("Request accepted successfully");
			window.location.reload();
		} catch (err) {
			console.error("Failed to accept request:", err);
		}
	};

	// Render the group page with group details, admin actions, and posts.
	return (
		<div className="group-page">
			<h1>{groupInfo.name || "Loading..."}</h1>
			<h2>Members</h2>
			<ul className="members-list">
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

			<h2>Join requests</h2>
			<ul className="members-list">
				<div>
					{requests && requests.length > 0 ? (
						requests.map((request) => (
							<li className="request" key={request._id}>
								<p>{request.username}</p>{" "}
								<button onClick={() => handleAcceptRequest(request._id)}>
									Accept
								</button>
							</li>
						))
					) : (
						<li>No members found</li>
					)}
				</div>
			</ul>

			<h2>Post something...</h2>
			<div className="post-section">
				<CreatePost groupId={groupId} />
				<PostFeed groupId={groupId} />
				{/* Render PostFeed with group's posts. */}
			</div>
		</div>
	);
};
export default GroupPage;
