import React, { useEffect, useState } from 'react';

function Posts() {
    const [posts, setPosts] = useState([]); 

    // Fetch posts from the backend
    useEffect(() => {
        fetch('http://localhost:8000/post', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                const postsArray = Array.isArray(data) ? data : [data];
                setPosts(postsArray);
            })
            .catch(error => console.error('Failed to fetch posts:', error));
    }, []);

    // Function to handle post deletion
    const deletePost = (postId) => {
        fetch(`http://localhost:8000/post/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
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
            {posts.map((post, index) => (
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