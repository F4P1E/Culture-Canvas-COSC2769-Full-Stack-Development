import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../slices/postSlice";
import CommentSection from "./CommentSection"; // Import CommentSection if needed

const Post = ({ post }) => {
	const [showDetails, setShowDetails] = useState(false);
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);

	// Toggle detailed view
	const handleToggleDetails = () => {
		setShowDetails(!showDetails);
	};

	// Fetch post details when showing details for the first time
	useEffect(() => {
		if (showDetails) {
			const fetchPostDetails = async () => {
				try {
					const response = await fetch(
						`http://localhost:8000/post/${post._id}`,
						{
							method: "GET", // HTTP method for the request.
							credentials: "include", // Include credentials (cookies) in the request.
						}
					);

					if (!response.ok) {
						throw new Error("Network response was not ok");
					}

					const data = await response.json();
					dispatch(updatePost({ post: data.post }));
				} catch (error) {
					console.error("Failed to fetch post details:", error);
				}
			};

			fetchPostDetails();
		}
	}, [showDetails, post._id, dispatch]);

	return (
		<div>
			<button onClick={handleToggleDetails}>
				{showDetails ? "Hide Details" : "Show Details"}
			</button>
			{showDetails && (
				<div>
					<h4>Description</h4>
					<p>{post.content}</p>
					<CommentSection postId={post._id} />
				</div>
			)}
		</div>
	);
};

export default Post;
