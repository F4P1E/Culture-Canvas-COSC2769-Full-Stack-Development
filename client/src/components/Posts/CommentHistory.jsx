import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCommentHistory } from "../../slices/postSlice";
import { useParams } from "react-router-dom";

const CommentHistory = () => {
	const dispatch = useDispatch();
	//let commentId = useSelector((state) => state.posts.currentId);
	const { commentId } = useParams();
	console.log(`CommentId:${commentId}`);
	const commentHistory = useSelector((state) => state.posts.commentHistories);
	console.log(`History:${JSON.stringify(commentHistory)}`);

	useEffect(() => {
		const fetchCommentHistory = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/post/comment/${commentId}/history`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				console.log(`Data: ${JSON.stringify(data)}`);
				dispatch(setCommentHistory(data));
			} catch (error) {
				console.error("Failed to fetch comment history:", error);
			}
		};

		if (commentId) {
			fetchCommentHistory();
		}
	}, [dispatch, commentId]);

	return (
		<div>
			<h1>Comment History</h1>
			<ul>
				{commentHistory.map((comment) => (
					<li key={comment.version}>
						<p>Version: {comment.version}</p>
						<p>Comment: {comment.content}</p>
                        <br />
					</li>
				))}
			</ul>
		</div>
	);
};

export default CommentHistory;
