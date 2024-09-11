import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, getComments, deleteComment } from "../../slices/postSlice";

function Posts() {
	const dispatch = useDispatch();
	const { posts } = useSelector((state) => state.posts);
	const comments = useSelector((state) => state.posts.comments);

	const [selectedPostId, setPostId] = useState(null);
	const [selectedCommentId, setCommentId] = useState(null);

	// Fetch posts from the backend
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch("http://localhost:8000/post/all", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch posts. Please try again later.");
				}

				const data = await response.json();

				dispatch(setPosts(data));
				dispatch(getComments(data));
			} catch (err) {
				console.error("Failed to fetch posts:", err);
			}
		};

		fetchPosts();
	}, [dispatch]);

	// Function to handle post deletion
	const handleDeletePost = (postId) => {
		fetch(`http://localhost:8000/post/${postId}`, {
			method: "DELETE",
			credentials: "include",
		})
			.then((response) => {
				if (response.ok) {
					setPosts(posts.filter((post) => post._id !== postId));
					alert("Post deleted successfully");
					window.location.reload();
				} else {
					alert("Failed to delete the post.");
				}
			})
			.catch((error) => console.error("Failed to delete post:", error));
	};

	const handleRemoveComment = async (postId, commentId) => {
		try {
			const response = await fetch(
				`http://localhost:8000/post/${postId}/comment/${commentId}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to delete comment");
			}

			setPostId(postId);
			setCommentId(commentId);

			setPosts(comments.filter((comment) => comment._id !== selectedCommentId));

			alert("Comment deleted successfully");
			window.location.reload();
		} catch (error) {
			console.error("Error deleting comment:", error);
		}
	};

	return (
		<div>
			<h1>Posts Management</h1>

			<ul>
				{posts.map((post) => (
					<li key={post._id}>
						<div>
							<div>{post.content}</div>

							<button onClick={() => handleDeletePost(post._id)}>
								Delete Post
							</button>
						</div>
						<br />
						<ul>
							{post.comments.map((comment) => (
								<li key={comment._id}>
									{comment.content}

									<button
										onClick={() => handleRemoveComment(post._id, comment._id)}
									>
										Delete Comment
									</button>
									<br />
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Posts;
