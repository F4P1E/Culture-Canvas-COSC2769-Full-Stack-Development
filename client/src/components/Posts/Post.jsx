import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost, addReaction } from "../../slices/postSlice";
import PostDetail from "./PostDetail";

const Post = ({ post }) => {
	const [showDetails, setShowDetails] = useState(false);
	const userId = useSelector((state) => state.auth.user._id);
	const dispatch = useDispatch();

	// Toggle detailed view
	const handleToggleDetails = () => {
		setShowDetails(!showDetails);
	};

	// Fetch post details only if post exists and showDetails is true
	useEffect(() => {
		if (showDetails && post?._id) {
			const fetchPostDetails = async () => {
				try {
					const response = await fetch(
						`http://localhost:8000/post/${post._id}`,
						{
							method: "GET",
							credentials: "include",
						}
					);

					if (!response.ok) {
						throw new Error("Network response was not ok");
					}

					const data = await response.json();
					if (data && data.post) {
						dispatch(updatePost({ post: data.post })); // Update post details in Redux.
					}
				} catch (error) {
					console.error("Failed to fetch post details:", error);
				}
			};

			fetchPostDetails();
		}
	}, [showDetails, post?._id, dispatch]); // Check that post exists before trying to fetch details

	const handleReaction = async (reactionType) => {
		try {
			const response = await fetch(
				`http://localhost:8000/post/${post._id}/reaction`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ reactionType }),
					credentials: "include",
				}
			);

			if (response.ok) {
				const data = await response.json();
				dispatch(addReaction({ postId: post._id, userId, ...data }));
			}
		} catch (error) {
			console.error("Failed to update reaction:", error);
		}
	};

	const getShortContent = (content) => {
		const truncatedContent =
			content.length > 100 ? content.substring(0, 100) + "..." : content;
		const formattedContent = truncatedContent
			.replace(/\n/g, "<br>")
			.replace(/\t/g, "&emsp;");

		return formattedContent;
	};

	const getLongContent = (content) => {
		const formattedContent = content
			.replace(/\n/g, "<br>")
			.replace(/\t/g, "&emsp;");
		return formattedContent;
	};

	return (
		<>
			<div>
				<p>
					<strong>By: {post?.username || "Anonymous"} &nbsp;|&nbsp; </strong>
					<i>
						{new Date(post?.createdAt).toLocaleString("en-US", {
							year: "numeric",
							month: "numeric",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							hour12: true,
						})}
					</i>{" "}
					<strong>&nbsp;{post?.__v !== 0 ? "(Edited)" : ""} </strong>
				</p>{" "}
				{/* Display username */}
				<p
					dangerouslySetInnerHTML={{
						__html: showDetails
							? getLongContent(post?.content)
							: getShortContent(post?.content),
					}}
				/>
				<button onClick={handleToggleDetails}>
					{showDetails ? "Hide Details" : "Show Details"}
				</button>
				{/* Handle reactions */}
				<div>
					<button onClick={() => handleReaction("like")}>Like</button>
					<button onClick={() => handleReaction("love")}>Love</button>
					<button onClick={() => handleReaction("haha")}>Haha</button>
					<button onClick={() => handleReaction("angry")}>Angry</button>
				</div>
				{/* Conditionally render the PostDetail component when showDetails is true */}
				{showDetails && post?._id && <PostDetail postId={post._id} />}
			</div>
			<br />
		</>
	);
};

export default Post;
