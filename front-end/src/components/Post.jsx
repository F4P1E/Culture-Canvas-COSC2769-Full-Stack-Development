import React, { useState } from 'react';


const Post = ({ post }) => {
  // State for managing reactions
  const [reactions, setReactions] = useState(post.reactions);
  
  // State for managing comments
  const [comments, setComments] = useState(post.comments);
  
  // State for managing the new comment input
  const [newComment, setNewComment] = useState('');

  // Function to handle reaction button clicks
  const handleReaction = (type) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [type]: prevReactions[type] + 1,
    }));
  };

  // Function to handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const newCommentObject = {
        id: Date.now(), // Unique ID for the comment
        author: 'Current User', // Replace with current user's name
        content: newComment,
        timestamp: new Date().toISOString(),
      };
      setComments((prevComments) => [...prevComments, newCommentObject]);
      setNewComment(''); // Clear the input field
    }
  };

  // Function to handle sharing a post
  const handleShare = () => {
    console.log(`Post shared by ${post.author}`);
    // Implement share functionality here (e.g., share the post URL)
  };

  return (
    <div className="post">
      <h4>{post.author}</h4>
      <p>{post.content}</p>
      <div className="post-timestamp">{new Date(post.timestamp).toLocaleString()}</div>
      
      <div className="post-reactions">
        <button onClick={() => handleReaction('like')}>👍 {reactions.like}</button>
        <button onClick={() => handleReaction('love')}>❤️ {reactions.love}</button>
        <button onClick={() => handleReaction('haha')}>😂 {reactions.haha}</button>
        <button onClick={() => handleReaction('angry')}>😠 {reactions.angry}</button>
      </div>

      <div className="post-comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.author}</strong> {comment.content}</p>
            <div className="comment-timestamp">{new Date(comment.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="add-comment">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>

      <div className="post-actions">
        <button onClick={() => handleReaction('like')}>Like</button>
        <button onClick={() => handleAddComment()}>Comment</button>
        <button onClick={handleShare}>Share</button>
      </div>
    </div>
  );
};

export default Post;
