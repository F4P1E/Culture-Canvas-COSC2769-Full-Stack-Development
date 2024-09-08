import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePost, addReaction } from "../../slices/postSlice";
import PostDetail from "./PostDetail";

const Post = ({ post }) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  // Toggle detailed view
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Fetch post details only if post exists and showDetails is true
  useEffect(() => {
    if (showDetails && post?._id) {
      const fetchPostDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/post/${post._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          if (data && data.post) {
            dispatch(updatePost({ post: data.post })); // Update post details in Redux.
          }
        } catch (error) {
          console.error("Failed to fetch post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, [showDetails, post?._id, dispatch]); // Check that post exists before trying to fetch details

  const handleReaction = async (reactionType) => {
    try {
      const response = await fetch(
        `http://localhost:8000/post/${post._id}/reaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reactionType }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(addReaction({ postId: post._id, ...data.reaction }));
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  const getShortContent = (content) => {
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  return (
    <div>
      <h4>{post?.title}</h4>
      <p>{showDetails ? post?.content : getShortContent(post?.content)}</p>
      <button onClick={handleToggleDetails}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {/* Handle reactions */}
      <div>
        <button onClick={() => handleReaction("like")}>Like</button>
        <button onClick={() => handleReaction("love")}>Love</button>
      </div>

      {/* Conditionally render the PostDetail component when showDetails is true */}
      {showDetails && post?._id && <PostDetail postId={post._id} />}
    </div>
  );
};

export default Post;
