import React from "react";
import { useSelector } from "react-redux";
import { setCommentHistory } from "../../slices/postSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const CommentHistory = () => {
	const dispatch = useDispatch();
    const commentId = useSelector((state) => state.posts.commentHistory.currentCommentId);
    console.log(`Current Comment ID: ${commentId}`);
    const commentHistory = useSelector((state) => state.posts.commentHistory.history);
    console.log(`Comment History: ${commentHistory}`);

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
            {commentHistory.map((comment) => (
                <p key={comment._id} value={comment} />
            ))}
        </div>
    );
};

export default CommentHistory;
