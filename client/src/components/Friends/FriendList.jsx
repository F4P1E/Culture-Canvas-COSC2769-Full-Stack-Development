import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewFriendList, unFriend } from "../../slices/friendSlice";

const FriendList = () => {
	const dispatch = useDispatch();

	// Access user ID from the Redux store
	const userId = useSelector((state) => state.auth.user?._id);

	// Access friends list, loading state, and error state from the Redux store
	const { friends, loading, error } = useSelector((state) => state.friends);

	// Fetch friends list when the component mounts or when userId changes

	useEffect(() => {
		// Function to fetch friends data from the API
		const fetchFriends = async () => {
			try {
				// Fetch friends data from the API with authorization header
				const response = await fetch(
					`http://localhost:8000/${userId}/friends`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();

				dispatch(viewFriendList(data));
			} catch (error) {
				console.error("Failed to fetch friends:", error);
			}
		};

		// Only fetch friends if userId is available (ensures user is logged in)
		if (userId) {
			fetchFriends();
		}
	}, [userId]);

	// Function to handle unfriending a friend
	const handleUnFriend = (friendId) => {
		const deleteFriend = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/friend/${friendId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to unfriend");
				}

				dispatch(unFriend(friendId));
			} catch (error) {
				// Handle any errors
				console.error("Failed to unfriend:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			deleteFriend();
		}
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<ul className="friend-list">
				{/* Render the list of friends */}
				{friends.map((friend) => (
					<li key={friend._id}>
						<p className="friend-list-name">{friend.username}</p>
						<br />
						{/* Example buttons for adding, unfriending, accepting, and canceling friend requests */}
						<button onClick={() => handleUnFriend(friend._id)}>Unfriend</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FriendList;
