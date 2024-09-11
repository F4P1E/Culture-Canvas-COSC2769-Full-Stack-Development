import "../styles/Post.scss";
import React, { useState, useEffect } from "react";
import PostDetail from "./PostDetail";
import { FaThumbsUp, FaHeart, FaLaugh, FaAngry } from "react-icons/fa";
import { useSelector } from "react-redux";

const Post = ({ post }) => {
	const [showDetails, setShowDetails] = useState(false);
	const [localReactions, setLocalReactions] = useState(post.reactions);
	const [reactionCounts, setReactionCounts] = useState({
		like: post.reactions.like.length,
		love: post.reactions.love.length,
		haha: post.reactions.haha.length,
		angry: post.reactions.angry.length,
	});
	const [userReactions, setUserReactions] = useState(null); // Track user's reaction
	const userId = useSelector((state) => state.auth.user._id);

	useEffect(() => {
		if (post && post.reactions) {
			const userReactionType = ["like", "love", "haha", "angry"].find(
				(reactionType) =>
					post.reactions[reactionType].some(
						(reaction) => reaction.user === userId
					)
			);
			setUserReactions(userReactionType);
		}
	}, [post.reactions, userId]);

	const handleReaction = async (reactionType) => {
		try {
			const currentReaction = userReactions;
			let newReactionType = null;

			// Remove the reaction if it's the same, otherwise set a new one
			if (currentReaction === reactionType) {
				newReactionType = null;
			} else {
				newReactionType = reactionType;
			}

			const response = await fetch(
				`http://localhost:8000/post/${post._id}/reaction`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ reactionType: newReactionType }),
					credentials: "include",
				}
			);

			if (response.ok) {
				const data = await response.json();
				setLocalReactions(data.reactions);
				setUserReactions(newReactionType);

				setReactionCounts({
					like: data.reactions.like.length,
					love: data.reactions.love.length,
					haha: data.reactions.haha.length,
					angry: data.reactions.angry.length,
				});
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
		<div className="post-container">
			<p>
				<strong>By: {post?.username || "Anonymous"}&nbsp;&nbsp; </strong>
				{" "}
				<i style={{ color: "#A0A0A0", fontWeight: "650" }}>
					{post?.oldVersions.length > 0 ? "(Edited)" : ""}
				</i>
			</p>
			<p
				dangerouslySetInnerHTML={{
					__html: showDetails
						? getLongContent(post?.content)
						: getShortContent(post?.content),
				}}
			/>
			{/* Reaction buttons */}
			<div className="reactions">
				<button
					className={`reaction-icon ${
						userReactions === "like" ? "active" : ""
					}`}
					onClick={() => handleReaction("like")}
				>
					<FaThumbsUp />
					<b className="reaction-text">{reactionCounts.like}</b>
				</button>
				<button
					className={`reaction-icon ${
						userReactions === "love" ? "active" : ""
					}`}
					onClick={() => handleReaction("love")}
				>
					<FaHeart />
					<b className="reaction-text">{reactionCounts.love}</b>
				</button>
				<button
					className={`reaction-icon ${
						userReactions === "haha" ? "active" : ""
					}`}
					onClick={() => handleReaction("haha")}
				>
					<FaLaugh />
					<b className="reaction-text">{reactionCounts.haha}</b>
				</button>
				<button
					className={`reaction-icon ${
						userReactions === "angry" ? "active" : ""
					}`}
					onClick={() => handleReaction("angry")}
				>
					<FaAngry />
					<b className="reaction-text">{reactionCounts.angry}</b>
				</button>
			</div>
			{/* Toggle to show post details */}
			<button
				className="toggle-details-btn"
				onClick={() => setShowDetails(!showDetails)}
			>
				{showDetails ? "Hide Details" : "Show Details"}
			</button>
			{showDetails && <PostDetail postId={post._id} />}
		</div>
	);
};

export default Post;
