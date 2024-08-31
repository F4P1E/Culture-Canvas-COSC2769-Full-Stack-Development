// Importing React hooks, Redux hooks, and action creators.
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../slices/postSlice';

// CommentSection component to manage and display comments on a post.
const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();  // Hook to dispatch Redux actions.
  const posts = useSelector((state) => state.posts.posts);  // Selector to access posts state from Redux store.
  const post = posts.find(post => post._id === postId);  // Find the post by ID.
  const [comment, setComment] = useState('');  // Local state for new comment input.

  // Fetch the post with comments from the server when the component mounts or postId changes.
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`http://localhost:8000/post/${post._id}`, {
        method: 'GET',  // HTTP method for the request.
      });
      const data = await response.json();  // Parse the response data.
      dispatch(updatePost({ post: data.post }));  // Dispatch action to update post with comments.
    };

    fetchPost();  // Call the fetch function.
  }, [dispatch, postId]);  // Dependency array to run effect when dispatch or postId changes.

  // Function to handle adding a new comment.
  const handleAddComment = async () => {
    const response = await fetch(`http://localhost:3001/routes/posts/${postId}/comments`, {
      method: 'POST',  // HTTP method for the request.
      headers: { 'Content-Type': 'application/json' },  // Header to indicate JSON body.
      body: JSON.stringify({ comment }),  // Request body with new comment.
    });

    if (response.ok) {
      const data = await response.json();  // Parse the response data.
      dispatch(updatePost({ post: data.post }));  // Dispatch action to update post with new comment.
      setComment('');  // Clear the comment input field.
    }
  };

  // Render the comment section with input field and existing comments.
  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {post && post.comments.map((comment) => (  // Map over comments array to render each comment.
          <li key={comment._id}>{comment.text}</li>  // Each comment item with unique key.
        ))}
      </ul>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}  // Update local state with new comment input.
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default CommentSection;
