import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	updatePost,
	getComments,
	addComment,
	setCommentFailure,
} from "../../slices/postSlice";
import { FaThumbsUp, FaHeart, FaLaugh, FaAngry } from "react-icons/fa";

const PostDetail = ({ postId }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector((state) => state.auth.user._id);
	const posts = useSelector((state) => state.posts.posts);
	const post = posts.find((p) => p._id === postId);
	const comments = useSelector((state) => state.posts.comments);
	const [content, setComment] = useState("");
	const [selectedCommentId, setSelectedCommentId] = useState(null);
	const [editPostContent, setEditPostContent] = useState(post?.content || "");
	const [editCommentId, setEditCommentId] = useState(null);
	const [editCommentContent, setEditCommentContent] = useState("");
	const [commentFailure, setCommentFailure] = useState(null);
	const [isEditingPost, setIsEditingPost] = useState(false);
	const [reactions, setReactions] = useState({
		like: [],
		love: [],
		haha: [],
		angry: [],
	});
	const [reactionCount, setReactionCount] = useState();
	const [commentReactions, setCommentReactions] = useState({});
	const [userReactions, setUserReactions] = useState({}); // Track user reactions locally

	useEffect(() => {
		if (postId) {
			const fetchPost = async () => {
				try {
					const response = await fetch(`http://localhost:8000/post/${postId}`, {
						method: "GET",
						credentials: "include",
					});
					const data = await response.json();

					if (data) {
						dispatch(updatePost({ post: data }));
						setReactions(data.reactions);
						setReactionCount(data.reactionCount);
					}
				} catch (error) {
					console.error("Failed to fetch post:", error);
				}
			};

			fetchPost();
		}
	}, [dispatch, postId]);

	useEffect(() => {
		if (postId) {
			const fetchComments = async () => {
				const response = await fetch(
					`http://localhost:8000/post/${postId}/comments`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				const data = await response.json();
				dispatch(getComments(data));

				const initialCommentReactions = {};
				const initialUserReactions = {};

				data.forEach((comment) => {
					initialCommentReactions[comment._id] = {
						like: comment.reactions.like || [],
						love: comment.reactions.love || [],
						haha: comment.reactions.haha || [],
						angry: comment.reactions.angry || [],
					};

					const userReaction = ["like", "love", "haha", "angry"].find((type) =>
						comment.reactions[type].some(
							(reaction) => reaction.user.toString() === userId.toString()
						)
					);
					initialUserReactions[comment._id] = userReaction || null;
				});

				setCommentReactions(initialCommentReactions);
				setUserReactions(initialUserReactions);
			};
			fetchComments();
		}
	}, [postId, dispatch, userId]);

	const handleCommentReaction = async (reactionType, commentId) => {
		try {
			const currentReaction = userReactions[commentId];
			let newReactionType = null;

			if (currentReaction === reactionType) {
				// Remove the reaction if it is already set
				newReactionType = null;
			} else {
				// Set the new reaction
				newReactionType = reactionType;
			}

			// Update the reaction on the backend
			const response = await fetch(
				`http://localhost:8000/post/comment/${commentId}/reaction`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ reactionType: newReactionType }),
					credentials: "include",
				}
			);

			if (response.ok) {
				const data = await response.json();
				setCommentReactions((prevReactions) => ({
					...prevReactions,
					[commentId]: data.reactions,
				}));
				setUserReactions((prevUserReactions) => ({
					...prevUserReactions,
					[commentId]: newReactionType,
				}));
			}
		} catch (error) {
			console.error("Failed to update reaction:", error);
		}
	};

	const handleAddComment = async () => {
		try {
			const response = await fetch(
				`http://localhost:8000/post/${postId}/comment`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content }),
					credentials: "include",
				}
			);

			if (response.ok) {
				const data = await response.json();
				dispatch(addComment({ postId, comment: data.comment }));
				setComment(""); // Clear the input field
				alert("Comment added successfully!");
			}
		} catch (err) {
			dispatch(setCommentFailure(err.message));
		}
	};

	const handlePostEdit = async () => {
		try {
			const response = await fetch(`http://localhost:8000/post/${postId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: editPostContent }),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			alert("Post updated successfully!");
			window.location.reload();
		} catch (error) {
			console.error("Failed to update post:", error);
		}
	};

	const handleCommentEdit = async (commentId) => {
		try {
			const response = await fetch(
				`http://localhost:8000/post/${postId}/comment/${commentId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content: editCommentContent }),
					credentials: "include",
				}
			);

			if (response.ok) {
				const data = await response.json();
				setEditCommentContent(data);
				setEditCommentId(null);
				alert("Comment updated successfully!");
				window.location.reload();
			}
		} catch (error) {
			console.error("Failed to update comment:", error);
		}
	};

	const handleRedirectToPostHistory = (currentId) => {
		navigate(`/posthistory/${currentId}`);
	};

	const handleRedirectToCommentHistory = (currentId) => {
		navigate(`/commenthistory/${currentId}`);
	};

	const formatContent = (content) => {
		const formattedContent = content
			.replace(/\n/g, "<br>")
			.replace(/\t/g, "&emsp;");
		return formattedContent;
	};

	return (
		<div className="post-detail-container">
			{post ? (
				<>
					{/* Post content */}

					{isEditingPost ? (
						<div className="edit-post-container">
							<textarea
								rows="4"
								cols="50"
								value={editPostContent}
								onChange={(e) => setEditPostContent(e.target.value)}
							/>
							<div className="edit-post-buttons">
								<button className="post-save" onClick={handlePostEdit}>
									Save Post
								</button>
								<button
									className="post-cancel"
									onClick={() => setIsEditingPost(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div className="viewing-post-container">
							<p>
								<strong>
									Created at: <br />
									<i>
										{new Date(post?.createdAt).toLocaleString("en-US", {
											year: "numeric",
											month: "numeric",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
											hour12: true,
										})}
									</i>
								</strong>
							</p>
							<p></p>
							<p
								dangerouslySetInnerHTML={{
									__html: formatContent(post.content),
								}}
							/>
							<div className="edit-post-buttons">
								{post.userId == userId && (
									<button
										className="edit-post"
										onClick={() => setIsEditingPost(true)}
									>
										Edit Post
									</button>
								)}
								&nbsp;&nbsp;
								<button
									className="view-post-history"
									onClick={() => {
										handleRedirectToPostHistory(postId);
									}}
								>
									View post history
								</button>
							</div>
						</div>
					)}
					<br />
					<h3>Comments</h3>
					<div className="comment-container">
						<textarea
							rows="4"
							cols="50"
							value={content}
							onChange={(e) => setComment(e.target.value)}
						/>
						<button className="comment-add" onClick={handleAddComment}>
							Add Comment
						</button>
					</div>
					<ul>
						{comments.map((comment) => (
							<li key={comment._id}>
								{editCommentId === comment._id ? (
									<div>
										<p>
											<strong>{comment.username || "Anonymous"}</strong>
										</p>
										<div className="comment-edit-container">
											<textarea
												rows="4"
												cols="50"
												value={editCommentContent}
												onChange={(e) => setEditCommentContent(e.target.value)}
											/>
											<div className="comment-edit-buttons">
												<button
													className="comment-save"
													onClick={() => handleCommentEdit(comment._id)}
												>
													Save Comment
												</button>
												<button
													className="comment-cancel"
													onClick={() => setEditCommentId(null)}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								) : (
									<div>
										<p>
											<strong>{comment.username || "Anonymous"}</strong>
										</p>
										<p>{comment.content}</p>
										<div className="reactions">
											<button
												className={`reaction-icon ${
													userReactions[comment._id] === "like" ? "active" : ""
												}`}
												onClick={() =>
													handleCommentReaction("like", comment._id)
												}
											>
												<FaThumbsUp />{" "}
												<b className="reaction-text">
													{commentReactions[comment._id]?.like.length || 0}
												</b>
											</button>
											<button
												className={`reaction-icon ${
													userReactions[comment._id] === "love" ? "active" : ""
												}`}
												onClick={() =>
													handleCommentReaction("love", comment._id)
												}
											>
												<FaHeart />{" "}
												<b className="reaction-text">
													{commentReactions[comment._id]?.love.length || 0}
												</b>
											</button>
											<button
												className={`reaction-icon ${
													userReactions[comment._id] === "haha" ? "active" : ""
												}`}
												onClick={() =>
													handleCommentReaction("haha", comment._id)
												}
											>
												<FaLaugh />{" "}
												<b className="reaction-text">
													{commentReactions[comment._id]?.haha.length || 0}
												</b>
											</button>
											<button
												className={`reaction-icon ${
													userReactions[comment._id] === "angry" ? "active" : ""
												}`}
												onClick={() =>
													handleCommentReaction("angry", comment._id)
												}
											>
												<FaAngry />{" "}
												<b className="reaction-text">
													{commentReactions[comment._id]?.angry.length || 0}
												</b>
											</button>
										</div>
										{comment.userId === userId && (
											<button
												className="comment-edit"
												onClick={() => {
													setEditCommentId(comment._id);
													setEditCommentContent(comment.content);
												}}
											>
												Edit
											</button>
										)}
										&nbsp;&nbsp;
										<button
											className="view-comment-history"
											onClick={() => {
												handleRedirectToCommentHistory(comment._id);
											}}
										>
											View comment history
										</button>
										<br />
										<br />
										<br />
									</div>
								)}
							</li>
						))}
					</ul>
				</>
			) : (
				<p>Loading post...</p>
			)}
		</div>
	);
};

export default PostDetail;
