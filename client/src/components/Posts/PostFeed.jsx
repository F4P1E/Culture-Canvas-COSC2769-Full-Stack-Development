import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setError, setLoading } from "../../slices/postSlice";
import Post from "./Post";

const PostFeed = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.posts); // Accessing posts, loading, and error states from Redux.

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading({ isLoading: true }));
      try {
        const response = await fetch("http://localhost:8000/post/", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts. Please try again later.");
        }

        const data = await response.json();

        if (data.status === "success") {
          dispatch(setPosts({ posts: data.data })); // Dispatch action to set posts in Redux store.
        } else {
          throw new Error(data.message || "Failed to fetch posts.");
        }
      } catch (err) {
        dispatch(setError({ error: err.message })); // Dispatch error to Redux store.
      } finally {
        dispatch(setLoading({ isLoading: false })); // Turn off loading state.
      }
    };

    fetchPosts(); // Call the fetch function on component mount.
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading posts...</div>; // Show loading indicator.
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message.
  }

  return (
    <div>
      {posts.length ? (
        posts.map((post) => <Post key={post._id} post={post} />) // Render each post.
      ) : (
        <p>No posts available</p> // Message if no posts are found.
      )}
    </div>
  );
};

export default PostFeed;
