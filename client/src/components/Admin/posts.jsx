import React, { useEffect, useState } from 'react';

function Posts() {
    const [posts, setPosts] = useState([]);

    // Fetch all posts from the backend
    useEffect(() => {
        fetch('http://localhost:8000/post')  // Adjust this endpoint as needed
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Failed to fetch posts:', error));
    }, []);

    // Function to handle post deletion
    const deletePost = (postId) => {
        fetch(`http://localhost:8000/post/${postId}`, { method: 'DELETE' })  // Adjust your API endpoint as needed
            .then(response => {
                if (response.ok) {
                    setPosts(posts.filter(post => post._id !== postId));
                } else {
                    alert('Failed to delete the post.');
                }
            })
            .catch(error => console.error('Failed to delete post:', error));
    };

    return (
        <div>
            <h1>Posts Management</h1>
            {posts.map(post => (
                <div key={post._id}>
                    <h4>{post.title}</h4>
                    <p>{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</p>
                    <button onClick={() => deletePost(post._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default Posts;
