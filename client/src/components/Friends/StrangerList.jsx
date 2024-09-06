import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	viewStrangersList,
	addFriend,
	acceptFriendRequest,
	cancelFriendRequest,
} from "../../slices/friendSlice";

const StrangerList = () => {
	const dispatch = useDispatch();

	// Access user ID from the Redux store
	const userId = useSelector((state) => state.auth.user?._id);
	console.log(`User ID: ${userId}`);

	// Access strangers list, loading state, and error state from the Redux store
	const { strangers, loading, error } = useSelector((state) => state.friends);

	useEffect(() => {
		const fetchStrangers = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/${userId}/strangers`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch strangers");
				}

				const data = await response.json();
				dispatch(viewStrangersList(data));
			} catch (error) {
				console.error("Failed to fetch strangers:", error);
			}
		};

		if (userId) {
			fetchStrangers();
		}
	}, [userId]); // Added dispatch to the dependencies array

	const handleAddFriend = (strangerId) => {
		
		const makeFriend = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/friend/${strangerId}`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to add friend");
				}

				dispatch(addFriend(strangerId));
			} catch (error) {
				console.error("Failed to add friend:", error);
			}
		};

		if (userId) {
			makeFriend();
		}
	};

	const handleAcceptFriendRequest = (strangerId) => {
		const acceptFriend = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/friendRequest/${strangerId}`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to accept friend request");
				}

				dispatch(acceptFriendRequest(strangerId));
			} catch (error) {
				console.error("Failed to accept friend request:", error);
			}
		};

		if (userId) {
			acceptFriend();
		}
	};

	const handleCancelFriendRequest = (strangerId) => {
		const cancelFriend = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/friendRequest/${strangerId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to cancel friend request");
				}

				dispatch(cancelFriendRequest(strangerId));
			} catch (error) {
				console.error("Failed to cancel friend request:", error);
			}
		};

		if (userId) {
			cancelFriend();
		}
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<ul>
				{strangers.map((stranger) => (
					<li key={stranger._id}>
						{stranger.username}
						<br />
						<button onClick={() => handleAddFriend(stranger._id)}>
							Add Friend
						</button>
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
