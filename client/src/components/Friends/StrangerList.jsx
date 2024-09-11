import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewStrangersList, addFriend } from "../../slices/friendSlice";

const StrangerList = () => {
	const dispatch = useDispatch();

	// Access user ID from the Redux store
	const userId = useSelector((state) => state.auth.user?._id);

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
					alert("Already sent a friend request!");
					throw new Error("Failed to send friend request");
				}

				dispatch(addFriend(strangerId));
				alert("Friend request sent!");
				window.location.reload();
			} catch (error) {
				console.error("Failed to connect:", error);
			}
		};

		if (userId) {
			makeFriend();
		}
	};

	return (
		<div className="stranger-list-container">
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<ul>
				{strangers.map((stranger) => (
					<li className="stranger-item" key={stranger._id}>
						<p className="stranger-info">{stranger.username}&nbsp;&nbsp;</p>
						<button
							className="stranger-buttons"
							onClick={() => handleAddFriend(stranger._id)}
						>
							Add Friend
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default StrangerList;
