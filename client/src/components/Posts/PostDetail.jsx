import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePost,
  addComment,
  editPost,
  editComment,
  recordPostHistory,
  recordCommentHistory,
  setCommentFailure,
} from "../../slices/postSlice";

const PostDetail = ({ postId }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const post = posts.find((p) => p._id === postId);
  const [comment, setComment] = useState("");
  const [editPostContent, setEditPostContent] = useState(post?.content || ""); // Local state for post editing
  const [editCommentId, setEditCommentId] = useState(null); // Track the comment being edited
  const [editCommentContent, setEditCommentContent] = useState(""); // Local state for comment editing
  const [commentFailure, setCommentFailure] = useState(null);
  const [isEditingPost, setIsEditingPost] = useState(false); // Toggle editing state for post

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
        }
      };

      fetchPost();
    }
  }, [dispatch, postId]);

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/post/${postId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
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
      // Record current post content in history
      dispatch(recordPostHistory({ postId, content: post.content }));

      const response = await fetch(`http://localhost:8000/post/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editPostContent }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(editPost({ postId, content: data.post.content }));
        setIsEditingPost(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  // Function to handle comment editing
  const handleCommentEdit = async (commentId) => {
    try {
      // Record current comment content in history
      const commentToEdit = post.comments.find((comment) => comment._id === commentId);
      dispatch(recordCommentHistory({ postId, commentId, content: commentToEdit.text }));

      const response = await fetch(
        `http://localhost:8000/post/${postId}/comment/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editCommentContent }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(editComment({ postId, commentId, text: data.comment.text }));
        setEditCommentId(null); // Exit edit mode for comment
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  return (
    <div>
      {post ? (
        <>
          {/* Post content */}
          {isEditingPost ? (
            <div>
              <textarea
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
              />
              <button onClick={handlePostEdit}>Save Post</button>
              <button onClick={() => setIsEditingPost(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{post.content}</p>
              <button onClick={() => setIsEditingPost(true)}>Edit Post</button>
            </div>
          )}

          <h3>Comments</h3>
          <ul>
            {post.comments.map((comment) => (
              <li key={comment._id}>
                {editCommentId === comment._id ? (
                  <div>
                    <input
                      type="text"
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                    />
                    <button onClick={() => handleCommentEdit(comment._id)}>Save</button>
                    <button onClick={() => setEditCommentId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    {comment.text}
                    <button onClick={() => {
                      setEditCommentId(comment._id);
                      setEditCommentContent(comment.text);
                    }}>
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Add new comment */}
          <input
            type="text"
            value={comment}
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
