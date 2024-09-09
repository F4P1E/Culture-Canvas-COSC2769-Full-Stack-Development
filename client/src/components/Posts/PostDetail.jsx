import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	updatePost,
	getComments,
	addComment,
	setCommentFailure,
} from "../../slices/postSlice";

const PostDetail = ({ postId }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const posts = useSelector((state) => state.posts.posts);
	const post = posts.find((p) => p._id === postId);
	const comments = useSelector((state) => state.posts.comments);
	const [content, setComment] = useState("");
	const [editPostContent, setEditPostContent] = useState(post?.content || ""); // Local state for post editing
	const [editCommentId, setEditCommentId] = useState(null); // Track the comment being edited
	const [editCommentContent, setEditCommentContent] = useState(""); // Local state for comment editing
	const [commentFailure, setCommentFailure] = useState(null);
	const [isEditingPost, setIsEditingPost] = useState(false); // Toggle editing state for post
	const [reactions, setReactions] = useState({ like: [], love: [], haha: [], angry: [] });

	useEffect(() => {
		if (postId) {
			const fetchPost = async () => {
				const response = await fetch(`http://localhost:8000/post/${postId}`, {
					method: "GET",
					credentials: "include",
				});
				const data = await response.json();
				if (data && data.post) {
					dispatch(updatePost({ post: data.post })); // Update post with comments
					setReactions(data.reactions); // Assuming the backend returns reactions grouped by type
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
			};
			fetchComments();
		}
	}, [postId, dispatch]);

	// Function to handle adding a new comment
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
			}
		} catch (err) {
			dispatch(setCommentFailure(err.message));
		}
	};

	// Function to handle post editing
	const handlePostEdit = async () => {
		try {
			const response = await fetch(`http://localhost:8000/post/${postId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: editPostContent }),
				credentials: "include",
			});

			if (response.ok) {
				window.location.reload();
			}
		} catch (error) {
			console.error("Failed to update post:", error);
		}
	};

	// Function to handle comment editing
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
				console.log(`Data: ${JSON.stringify(data)}`);
				setEditCommentContent(data);
				setEditCommentId(null); // Exit edit mode for comment
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

	return (
		<div>
			{post ? (
				<>
					{/* Post content */}
					{isEditingPost ? (
						<div>
							<textarea
								rows="4"
								cols="50"
								value={editPostContent}
								onChange={(e) => setEditPostContent(e.target.value)}
							/>
							<button onClick={handlePostEdit}>Save Post</button>
							<button onClick={() => setIsEditingPost(false)}>Cancel</button>
						</div>
					) : (
						<div>
							{/* Ensure user exists before accessing username */}
							<p>
								<strong>By: {post?.username || "Anonymous"}</strong>
							</p>
							<p>{post.content}</p>

							{/* Reactions Section */}
							<h3>Reactions</h3>
							<div>
								<p>Like: {reactions.like.map(user => user.username).join(", ")}</p>
								<p>Love: {reactions.love.map(user => user.username).join(", ")}</p>
								<p>Haha: {reactions.haha.map(user => user.username).join(", ")}</p>
								<p>Angry: {reactions.angry.map(user => user.username).join(", ")}</p>
							</div>

							<button onClick={() => setIsEditingPost(true)}>Edit Post</button>
							<button
								onClick={() => {
									handleRedirectToPostHistory(postId);
								}}
							>
								View post history!
							</button>
						</div>
					)}

					<h3>Comments</h3>
					<ul>
						{comments.map((comment) => (
							<li key={comment._id}>
								{editCommentId === comment._id ? (
									<div>
										<p>
											<strong>{comment?.username || "Anonymous"}</strong>
										</p>
										<input
											type="text"
											value={editCommentContent}
											onChange={(e) => setEditCommentContent(e.target.value)}
										/>
										<button onClick={() => handleCommentEdit(comment._id)}>
											Save
										</button>
										<button onClick={() => setEditCommentId(null)}>
											Cancel
										</button>
									</div>
								) : (
									<div>
										{/* Ensure user exists before accessing username */}
										{/* The backend is not returning any username yet (getPostComments)*/}
										<p>
											<strong>{comment?.username || "Anonymous"}</strong>
										</p>
										<p>{comment.content}</p>
										<button
											onClick={() => {
												setEditCommentId(comment._id);
												setEditCommentContent(comment.content);
											}}
										>
											Edit
										</button>
										<button
											onClick={() => {
												setEditCommentId(comment._id);
												handleRedirectToCommentHistory(comment._id);
											}}
										>
											View comment history!
										</button>
									</div>
								)}
							</li>
						))}
					</ul>

					{/* Add new comment */}
					<input
						type="text"
						value={content}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button onClick={handleAddComment}>Add Comment</button>
					{commentFailure && <p>Error: {commentFailure}</p>}
				</>
			) : (
				<p>Loading post details...</p>
			)}
		</div>
	);
};

export default PostDetail;
