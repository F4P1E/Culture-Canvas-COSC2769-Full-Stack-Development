import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewStrangersList, addFriend, acceptFriendRequest, cancelFriendRequest } from "../../slices/friendSlice";

const StrangerList = () => {
	const dispatch = useDispatch();

	// Access user ID from the Redux store
	const userId = useSelector((state) => state.auth.user?._id);

	// Access strangers list, loading state, and error state from the Redux store
	const { strangers, loading, error } = useSelector((state) => state.friends);

    useEffect(() => {
		// Function to fetch friends data from the API
		const fetchStrangers = async () => {
			try {
				// Fetch friends data from the API with authorization header
				const response = await fetch(
					`http://localhost:8000/${userId}/friends`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				// Check if the response is ok (status in the range 200-299)
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				// Parse the response JSON
				const data = await response.json();

				// Update the state with the fetched friends data
				dispatch(viewStrangersList(data));
			} catch (error) {
				// Handle errors (e.g., network issues, invalid responses)
				console.error("Failed to fetch anybody:", error);
			}
		};

		if (userId) {
			fetchStrangers();
		}
	}, [userId, dispatch]); // Dependencies array: runs the effect if userId changes

	// Function to handle adding a friend
	const handleAddFriend = (strangerId) => {
		const makeFriend = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/friend/${strangerId}`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					response.status(400).json("Failed to add friend");
				}

				// Dispatch the unFriend action to update the Redux store
				dispatch(addFriend(strangerId));
			} catch (error) {
				// Handle any errors
				response.status(400).json("Failed to add friend:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			makeFriend();
		}
	};

	// Function to handle accepting a friend request
	const handleAcceptFriendRequest = (strangerId) => {
		const acceptFriend = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/friendRequest/${strangerId}`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Failed to unfriend");
				}

				// Dispatch the unFriend action to update the Redux store
				dispatch(acceptFriendRequest(strangerId));
			} catch (error) {
				// Handle any errors
				console.error("Failed to unfriend:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			acceptFriend();
		}
	};

	// Function to handle canceling a friend request
	const handleCancelFriendRequest = (strangerId) => {
		const cancelFriend = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/friendRequest/${strangerId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Failed to unfriend");
				}

				// Dispatch the unFriend action to update the Redux store
				dispatch(cancelFriendRequest(strangerId));
			} catch (error) {
				// Handle any errors
				console.error("Failed to cancel friend request:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			cancelFriend();
		}
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<ul>
				{/* Render the list of strangers */}
				{strangers.map((stranger) => (
					<li key={stranger._id}>
						{stranger.username}
						<br />
						<button onClick={() => handleAddFriend(stranger._id)}>Add Friend</button>
						<br />
						<button onClick={() => handleAcceptFriendRequest(stranger._id)}>
							Accept Request
						</button>
						<br />
						<button onClick={() => handleCancelFriendRequest(stranger._id)}>
							Cancel Request
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default StrangerList;
