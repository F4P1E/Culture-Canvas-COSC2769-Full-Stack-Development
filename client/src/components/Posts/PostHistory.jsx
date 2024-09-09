import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPostHistory } from "../../slices/postSlice";
import { useParams } from "react-router-dom";

const PostHistory = () => {
	const dispatch = useDispatch();
	//let commentId = useSelector((state) => state.posts.currentId);
	const { postId } = useParams();
	console.log(`CommentId:${postId}`);
	const postHistory = useSelector((state) => state.posts.postHistories);
	console.log(`History:${JSON.stringify(postHistory)}`);

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
		<div>
			<h1>Post History</h1>
			<ul>
				{postHistory.map((post) => (
					<li key={post._id}>
						<p>Version: {post.version}</p>
						<p>Post: {post.content}</p>
                        <br />
					</li>
				))}
			</ul>
		</div>
	);
};

export default PostHistory;
