import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	setGroups,
	setCurrentGroup,
	fetchOneGroupInfo,
	setRequests,
	setMembers,
	approveJoinRequest,
	deleteMemberFromGroup,
} from "../../slices/groupSlice";

import {
	setPosts,
	setLoading,
	setError,
	deleteComment,
} from "../../slices/postSlice";
import "../styles/GroupAdmin.scss";
const GroupAdmin = () => {
	const dispatch = useDispatch();
	const [selectedGroupId, setSelectedGroupId] = useState(null);
	const [selectedPostId, setSelectedPostId] = useState(null);
	const [selectedCommentId, setSelectedCommentId] = useState(null);

	const userId = useSelector((state) => state.auth.user?._id);
	const groups = useSelector((state) => state.groups.groups); // Access the groups array from state
	const requests = useSelector((state) => state.groups.requests);
	const members = useSelector((state) => state.groups.members);

	const { posts, isLoading, error } = useSelector((state) => state.posts);

	const currentGroupId = useSelector((state) => state.groups.currentGroupId);

	// Fetch groups when the component mounts
	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await fetch(
					"http://localhost:8000/group/joined/admin",
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json(); // Parse the response data.

				dispatch(setGroups(data)); // Update Redux store with fetched groups.
			} catch (err) {
				console.error("Failed to fetch groups:", err);
			}
		};

		if (userId) {
			fetchGroups();
		}
	}, [userId, dispatch]); // Dependency array to refetch when it changes.

	// useEffect to fetch group requests when the component mounts.
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/group/requests/${selectedGroupId}`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json(); // Parse the response data.

				dispatch(setRequests(data)); // Update Redux store with fetched groups.
			} catch (err) {
				console.error("Failed to fetch requests:", err);
			}
		};

		if (userId) {
			fetchRequests();
		}
	}, [userId, selectedGroupId, dispatch]); // Dependency array to refetch when it changes.

	// useEffect to fetch group members when the component mounts.
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/group/${selectedGroupId}/members`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json(); // Parse the response data.

				dispatch(
					setMembers({
						groupId: selectedGroupId,
						currentUserId: userId,
						members: data,
					})
				);
			} catch (err) {
				console.error("Failed to fetch members:", err);
			}
		};

		if (userId) {
			fetchMembers();
		}
	}, [userId, selectedGroupId, dispatch]); // Dependency array to refetch when it changes.

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				let response;

				if (selectedGroupId) {
					response = await fetch("http://localhost:8000/post/", {
						method: "GET",
						credentials: "include",
						headers: { "Group-ID": selectedGroupId, Comments: "true" },
					});
				} else {
					response = await fetch("http://localhost:8000/post/", {
						method: "GET",
						credentials: "include",
					});
				}

				if (!response.ok) {
					throw new Error("Failed to fetch posts. Please try again later.");
				}

				const data = await response.json();

				if (!selectedGroupId) {
					dispatch(setPosts(null));
				} else {
					dispatch(setPosts(data)); // Dispatch action to set posts in Redux store.
				}
			} catch (err) {
				console.error("Failed to fetch posts:", err);
				// dispatch(setError({ error: err.message })); // Dispatch error to Redux store.
			}
		};

		fetchPosts(); // Call the fetch function on component mount.
	}, [selectedGroupId, dispatch]);

	const handleApproveJoinRequest = (requestId) => {
		const approveRequest = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/group/approve/${selectedGroupId}/${requestId}`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Failed to approve request");
				}

				const data = await response.json(); // Parse the response data.
				dispatch(approveJoinRequest(data));
				alert("Request approved successfully");
				window.location.reload();
			} catch (error) {
				// Handle any errors
				console.error("Network error:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			approveRequest();
		}
	};

	// Handle deleting a member from a group
	const handleDeleteMember = (memberId) => {
		const deleteMember = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/group/${selectedGroupId}/${memberId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Failed to remove this member");
				}

				const data = await response.json(); // Parse the response data.
				dispatch(deleteMemberFromGroup(data));
				alert("Member removed successfully");
				window.location.reload();
			} catch (error) {
				// Handle any errors
				console.error("Network error:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			deleteMember();
		}
	};

	// Handle deleting a post from a group
	const handleDeletePost = async (postId) => {
		if (selectedGroupId && postId) {
			try {
				const response = await fetch(
					`http://localhost:8000/group/${selectedGroupId}/post/${postId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to delete post");
				}

				// After successfully deleting the post, refetch the group details
				dispatch(fetchOneGroupInfo(selectedGroupId));

				alert("Post deleted successfully");
				window.location.reload();
			} catch (error) {
				console.error("Error deleting post:", error);
			}
		}
	};

	// Handle removing a comment from a specific post
	const handleRemoveComment = async (postId, commentId) => {
		if (selectedGroupId && postId && commentId) {
			try {
				const response = await fetch(
					`http://localhost:8000/group/${selectedGroupId}/post/${postId}/comment/${commentId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to delete comment");
				}

				dispatch(
					deleteComment({
						postId: postId,
						commentId: commentId,
					})
				);
				alert("Comment deleted successfully");
			} catch (error) {
				console.error("Error deleting comment:", error);
			}
		}
	};

	return (
		<div className="group-admin-panel">
			<h2>Group Admin Panel</h2>

			{/* Group selection */}
			<div>
				<h3>Group Selection</h3>
				<select
					onChange={(e) => {
						setSelectedGroupId(e.target.value);
					}}
					value={selectedGroupId || ""}
				>
					<option value="" disabled>
						Select a group
					</option>
					{groups.map((group) => (
						<option key={group._id} value={group._id}>
							{group.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<h3>Group Requests</h3>
				<ul>
					{selectedGroupId &&
						requests.map(
							(
								request // Map over requests array to render each request.
							) => (
								<li key={request._id}>
									{request.username}
									<button
										onClick={() => {
											handleApproveJoinRequest(request._id);
										}}
									>
										Approve Request
									</button>
								</li>
							)
						)}
				</ul>
			</div>

			<div>
				<h3>Group Members</h3>
				<ul>
					{selectedGroupId &&
						members.map(
							(
								member // Map over requests array to render each request.
							) => (
								<li>
									{member.username}
									<button
										onClick={() => {
											handleDeleteMember(member._id);
										}}
									>
										Remove Member
									</button>
								</li>
							)
						)}
				</ul>
			</div>

			{/* Group Posts */}
			<div>
				<h3>Group Posts</h3>
				{isLoading && <p>Loading posts...</p>}
				{error && <p>Error fetching posts: {error}</p>}
				{!isLoading && !error && posts && (
					<ul>
						{posts.map((post) => (
							<li key={post._id}>
								<div>{post.content}</div>
								<button onClick={() => handleDeletePost(post._id)}>
									Delete Post
								</button>
								<ul>
									{post.comments.map((comment) => (
										<li key={comment._id}>
											{comment.content}
											<button
												onClick={() =>
													handleRemoveComment(post._id, comment._id)
												}
											>
												Delete Comment
											</button>
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default GroupAdmin;
