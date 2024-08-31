import React, { useEffect, useState } from 'react';
import Post from './Post';  // Import the Post component

const PostFeed = () => {
  const [posts, setPosts] = useState([]); // Local state for storing posts.
  const [error, setError] = useState(null); // Local state for storing error messages.

  // useEffect to fetch posts when the component mounts.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/post'); // Update with the correct API endpoint.

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json(); // Parse the response data.
        setPosts(data); // Update state with fetched posts.
      } catch (err) {
        console.error('Failed to fetch posts:', err); // Log error to console.
        setError(err.message); // Update state with error message.
      }
    };

    fetchPosts(); // Call the fetch function.
  }, []); // Empty dependency array to fetch once on mount.

  if (error) {
    return <div>Error: {error}</div>; // Render error message if there is an error.
  }

  // Render a list of posts or a message if no posts are available.
  return (
    <div>
      {posts.length ? (
        posts.map(post => (
          <Post key={post._id} post={post} /> // Render each post using the Post component.
        ))
      ) : (
        <p>No posts available</p> // Message if no posts are found.
      )}
    </div>
  );
};

export default PostFeed;
