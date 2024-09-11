// SCSS
import "../styles/PostHistory.scss";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPostHistory } from "../../slices/postSlice";
import { useParams } from "react-router-dom";

const PostHistory = () => {
	const dispatch = useDispatch();
	const { postId } = useParams();
	const postHistory = useSelector((state) => state.posts.postHistories);

	useEffect(() => {
		const fetchPosttHistory = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/post/${postId}/history`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				dispatch(setPostHistory(data));
			} catch (error) {
				console.error("Failed to fetch comment history:", error);
			}
		};

		if (postId) {
			fetchPosttHistory();
		}
	}, [dispatch, postId]);

	return (
		<div className="post-history">
			<h1>Post History</h1>
			<div className="post-history-container">
				<ul>
					{postHistory.map((post) => (
						<li className="post-history-item" key={post._id}>
							<span className="post-history-info">
								<p>● Version: {post.version}</p>
								<p>&nbsp; ◽ Post: {post.content}</p>
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default PostHistory;
