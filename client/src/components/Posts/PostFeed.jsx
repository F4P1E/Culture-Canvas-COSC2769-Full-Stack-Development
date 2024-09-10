// SCSS
import "../styles/PostFeed.scss";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setError, setLoading } from "../../slices/postSlice";
import Post from "./Post";

const PostFeed = (groupIdRaw) => {
	const groupId = groupIdRaw.groupId;
	const dispatch = useDispatch();
	const { posts, isLoading, error } = useSelector((state) => state.posts); // Accessing posts, loading, and error states from Redux.

	useEffect(() => {
		const fetchPosts = async () => {
			dispatch(setLoading({ isLoading: true }));
			try {
				let response;

				if (groupId) {
					response = await fetch("http://localhost:8000/post/", {
						method: "GET",
						credentials: "include",
						headers: { "Group-ID": groupId },
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

				dispatch(setPosts(data)); // Dispatch action to set posts in Redux store.
			} catch (err) {
				dispatch(setError({ error: err.message })); // Dispatch error to Redux store.
			} finally {
				dispatch(setLoading({ isLoading: false })); // Turn off loading state.
			}
		};

		fetchPosts(); // Call the fetch function on component mount.
	}, [dispatch]);

	if (isLoading) {
		return <div>Loading posts...</div>; // Show loading indicator.
	}

	if (error) {
		return <div>Error: {error}</div>; // Show error message.
	}

	return (
		<div className="posts-feed-container">
			<h1>{groupId ? "Group Posts" : "Post Feed"}</h1>

			{posts.length ? (
				posts
					.filter((post) => post)
					.map(
						(
							post // Filter out undefined posts
						) => <Post key={post._id} post={post} />
					)
			) : (
				<p>No posts available</p>
			)}
		</div>
	);
};

export default PostFeed;
