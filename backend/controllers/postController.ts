import postModel from "../models/postModel";
import commentModel from "../models/commentModel";

import mongoose from "mongoose";

// Create new post
const createPost = async (request: any, response: any) => {
    const {username, content, reactions, reactionCount, visibility, comments} = request.body;

    let emptyFields: any[] = []

    /* if (!username) {
        emptyFields.push(username);
    } */
    if (!content) {
        emptyFields.push(content);
    }

    if (visibility && visibility !== "public" && visibility !== "friendsOnly") {
        return response.status(400).json({ error: "Invalid visibility" });
    }

    if (emptyFields.length > 0) {
        return response.status(400).json({ error: 'Please fill in all the table', emptyFields });
    }

    try {
        const userId = request.user._id 

        const post = await postModel.create({ userId, username, content, reactions, reactionCount, visibility, comments });
        response.status(200).json(post);
    } catch (error) {
        if (error instanceof Error) {
            response.status(400).json({ error: error.message });
        }
    }
}

// Get all post

const getPosts = async (request: any, response: any) => {
  try {
    const posts = await postModel.find({}).select('-oldVersions').exec();
    
    for (let i = posts.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [posts[i], posts[j]] = [posts[j], posts[i]];
    }
    response.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    response.status(500).json({ status: 'error', message: 'Failed to retrieve posts' });
  }
};

// Get all post from a user

const getPostsFromSpecificUser = async (request: any, response: any) => {
  try {
    const userId = request.params.id;
    const posts = await postModel.find({ userId }).sort({ createdAt: -1 }).exec();
    response.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    response.status(500).json({ status: 'error', message: 'Failed to retrieve posts from user' });
  }
};


// Get a single post

/* const getSinglePost = async (request: any, response: any) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
        response.status(404).json({ error: "Incorrect ID" });
    }
    const post = await postModel.findById(id);
    
    if (!post) {
        response.status(404).json({ error: "No such post" });
    } else {
        response.status(200).json(post);
    }
} */

//Delete a post

const deletePost = async (request: any, response: any) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
        return response.status(404).json({ error: "Incorrect ID" });
    }

    try {
        // Find the post by ID
        const post = await postModel.findById(id);

        if (!post) {
            return response.status(400).json({ error: "No such post" });
        }

        // Delete all comments associated with this post
        await commentModel.deleteMany({ _id: { $in: post.comments } });

        // Delete the post 
        await postModel.findByIdAndDelete(id);

        response.status(200).json({ message: "Post deleted" });
    } catch (error) {
        response.status(500).json({ error: "Internal server error" });
    }
};

// Update a post
const updatePost = async (request: any, response: any) => {
  const { id } = request.params;

  if (!mongoose.isValidObjectId(id)) {
    response.status(404).json({ error: "Incorrect ID" });
  }

  const post: any = await postModel.findOneAndUpdate({ _id: id }, {
    $set: { ...request.body },
    $inc: { __v: 1 }
  }, { upsert: true, new: true });

  if (!post) {
    return response.status(400).json({ error: "No such post" });
  }

  response.status(200).json({ message: "Post updated" });
}

// Get edit history
const getEditHistory = async (request: any, response: any) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      response.status(404).json({ error: "Incorrect ID" });
    }

    const post: any = await postModel.findOne({ _id: id });
    
    if (!post) {
      return response.status(400).json({ error: "No such post" });
    }

    const editHistory = post.oldVersions;

    response.status(200).json(editHistory);
}

//Create new comment

const createComment = async (request: any, response: any) => {
  const { content, reactions, reactionCount } = request.body;
  const postId = request.params.id
  const userId = request.user._id;

  let emptyFields: any[] = [];

  if (!content) {
    emptyFields.push(content);
  }

  if (emptyFields.length > 0) {
    return response.status(400).json({ error: 'Please comment something', emptyFields });
  }

  try {
    const comment = await commentModel.create({ postId, userId, content, reactions, reactionCount });
      const post = await postModel.findByIdAndUpdate(postId, {
            $push: {
              comments: comment._id,
            },
            $inc: { commentCount: 1 },
          }, { new: true } 
        );
    response.status(201).json(comment);
  } catch (error) {
    response.status(400).json({ error: "Cannot comment"});
  }
};

// Delete comment
const deleteComment = async (request: any, response: any) => {
  const postId = request.params.postId;
  const commentId = request.params.commentId;

  if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId)) {
    return response.status(404).json({ error: "Incorrect ID" });
  }

  try {
    const comment = await commentModel.findOneAndDelete({ _id: commentId });

    if (!comment) {
      return response.status(400).json({ error: "No such comment" });
    }

    const post = await postModel.findOneAndUpdate(
      { _id: postId, comments: commentId },
      {
        $pull: { comments: commentId },
        $inc: { commentCount: -1 }
      },
      { new: true }
    );

    if (!post) {
      return response.status(400).json({ error: "No associated post found for this comment" });
    }

    response.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
};

// Update comment
const updateComment = async (request: any, response: any) => {
  const postId = request.params.postId;
  const commentId = request.params.commentId;

  if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId)) {
    return response.status(404).json({ error: "Incorrect ID" });
  }

  try {
    const comment = await commentModel.findOneAndUpdate(
      { _id: commentId },
      {
        $set: { ...request.body },
        $inc: { __v: 1 }
      },
      { new: true }
    );

    if (!comment) {
      return response.status(400).json({ error: "No such comment" });
    }

    response.status(200).json({ message: "Comment updated" });
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
};

//View all comment from a post

const getCommentsFromPost = async (request: any, response: any) => {
  try {
    const postId = request.params.id;
    const post = await postModel.findById(postId);

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    const commentIds = post.comments;
    const comments = await commentModel.find({ _id: { $in: commentIds } }).select('-oldVersions').exec();

    response.status(200).json({ status: 'success', data: comments });
  } catch (error) {
    response.status(500).json({ status: 'error', message: 'Failed to retrieve comments' });
  }
};

// Get comment edit history
const getCommentEditHistory = async (request: any, response: any) => {
  const postId = request.params.postId;
  const commentId = request.params.commentId;

  if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId)) {
    response.status(404).json({ error: "Incorrect ID" });
  }

  const post: any = await postModel.findOne({ _id: postId });
  
  if (!post) {
    return response.status(400).json({ error: "No such post" });
  }

  const comment = await commentModel.findOne({ _id: commentId });

  if (!comment) {
    return response.status(400).json({ error: "No such comment" });
  }

  const editHistory = comment.oldVersions;

  response.status(200).json(editHistory);
};

export { createPost, getPosts, getPostsFromSpecificUser, deletePost, updatePost, getEditHistory, createComment, deleteComment, updateComment, getCommentsFromPost, getCommentEditHistory};