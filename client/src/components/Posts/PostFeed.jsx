import React, { useEffect, useState } from "react";
import Post from "./Post";

const PostFeed = () => {
	const [posts, setPosts] = useState([]); // Local state for storing posts.
	const [error, setError] = useState(null); // Local state for storing error messages.
	const [loading, setLoading] = useState(true); // Local state for loading status.

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch("http://localhost:8000/post/", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch posts. Please try again later.");
				}

				const contentType = response.headers.get("Content-Type");
				if (!contentType || !contentType.includes("application/json")) {
					throw new Error("Received non-JSON response.");
				}

				const data = await response.json();

				// Check for the success status
				if (data.status === "success") {
					setPosts(data.data); // Update state with the fetched posts.
				} else {
					throw new Error(data.message || "Failed to fetch posts.");
				}
			} catch (err) {
				console.error("Failed to fetch posts:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts(); // Call the fetch function.
	}, []); 

	if (loading) {
		return <div>Loading posts...</div>; // Show loading indicator while fetching.
	}

	if (error) {
		return <div>Error: {error}</div>; // Render error message if there is an error.
	}

	return (
		<div>
			{posts.length ? (
				posts.map((post) => (
					<Post key={post._id} post={post} /> // Render each post using the Post component.
				))
			) : (
				<p>No posts available</p> // Message if no posts are found.
			)}
		</div>
	);
};

export default PostFeed;
