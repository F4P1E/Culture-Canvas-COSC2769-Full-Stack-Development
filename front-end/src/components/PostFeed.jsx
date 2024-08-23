import React from 'react';
import Post from './Post';

const PostFeed = () => {
  const posts = [
    {
      id: 1,
      author: "John Doe",
      content: "Just had an amazing day at the beach! 🏖️",
      timestamp: "2024-08-20T10:34:00",
      reactions: {
        like: 5,
        love: 2,
        haha: 1,
        angry: 0,
      },
      comments: [
        {
          id: 1,
          author: "Jane Smith",
          content: "Looks like fun! Glad you enjoyed it.",
          timestamp: "2024-08-20T10:45:00",
        },
      ],
    },
    {
      id: 2,
      author: "Alice Johnson",
      content: "Excited to start my new job next week!",
      timestamp: "2024-08-19T14:12:00",
      reactions: {
        like: 12,
        love: 5,
        haha: 0,
        angry: 0,
      },
      comments: [
        {
          id: 2,
          author: "Bob Brown",
          content: "Congratulations! You'll do great.",
          timestamp: "2024-08-19T14:20:00",
        },
      ],
    },
    {
      id: 3,
      author: "Charlie Davis",
      content: "Does anyone have book recommendations? Looking for something new to read.",
      timestamp: "2024-08-18T08:00:00",
      reactions: {
        like: 3,
        love: 1,
        haha: 0,
        angry: 0,
      },
      comments: [
        {
          id: 3,
          author: "Emily Wilson",
          content: "You should check out 'The Great Gatsby' if you haven't already.",
          timestamp: "2024-08-18T08:15:00",
        },
      ],
    },
  ];

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
