
const postModel = require( "../models/postModel");
const commentModel = require("../models/commentModel");
const UserModel = require("../models/userModel");

const mongoose = require( "mongoose");

// Create new post
const createPost = async (request, response) => {
    const {username, content, reactions, reactionCount, visibility, comments} = request.body;

    let emptyFields = []

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

// Get a single post

/* const getSinglePost = async (request, response) => {
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

const deletePost = async (request, response) => {
    const { id } = request.params;
    const userId = request.user._id; 
    const userRole = (await UserModel.findOne({_id: userId})).role;

    if (!mongoose.isValidObjectId(id)) {
        return response.status(404).json({ error: "Incorrect ID" });
    }

    try {
        const post = await postModel.findById(id);

        if (!post) {
            return response.status(400).json({ error: "No such post" });
        }

        if (userRole !== "Admin" && post.userId.toString() !== userId.toString()) {
        return response.status(403).json({ error: "You can't delete other person's post" });
        }

        await commentModel.deleteMany({ _id: { $in: post.comments } });

        await postModel.findByIdAndDelete(id);

        response.status(200).json({ message: "Post deleted" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Update a post
const updatePost = async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.user._id;
    const userRole = (await UserModel.findOne({ _id: userId })).role;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(404).json({ error: "Incorrect ID" });
    }

    if (!userId || !userRole) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return response.status(400).json({ error: "No such post" });
    }

    if (post.userId.toString() !== userId.toString()) {
      return response.status(403).json({ error: "You can't update other person's post" });
    }

    const updatedPost = await postModel.findOneAndUpdate({ _id: id }, {
      $set: { ...request.body },
      $inc: { __v: 1 }
    }, { upsert: true, new: true });

    response.status(200).json({ message: "Post updated" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
};


//Create new comment

const createComment = async (request, response) => {
  const { content, reactions, reactionCount } = request.body;
  const postId = request.params.id
  const userId = request.user._id;

  let emptyFields = [];

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
const deleteComment = async (request, response) => {
  try {
    const postId = request.params.postId;
    const commentId = request.params.commentId;
    const userId = request.user._id;
    const userRole = (await UserModel.findOne({ _id: userId })).role;

    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId)) {
      return response.status(404).json({ error: "Incorrect ID" });
    }

    if (!userId || !userRole) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return response.status(400).json({ error: "No such comment" });
    }

    if (userRole !== "Admin" && comment.userId.toString() !== userId.toString()) {
      return response.status(403).json({ error: "You can't delete other person's comment" });
    }

    await commentModel.findOneAndDelete({ _id: commentId });

    const post = await postModel.findOneAndUpdate(
      { _id: postId, comments: commentId },
      {
        $pull: { comments: commentId },
        $inc: { commentCount: -1 }
      },
      { new: true }
    );

    response.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
};
// Update comment
const updateComment = async (request, response) => {
  try {
    const postId = request.params.postId;
    const commentId = request.params.commentId;
    const userId = request.user._id;

    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId)) {
      return response.status(404).json({ error: "Incorrect ID" });
    }

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return response.status(400).json({ error: "No such comment" });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return response.status(403).json({ error: "You can't update other person's comment" });
    }

    const updatedComment = await commentModel.findOneAndUpdate(
      { _id: commentId },
      {
        $set: { ...request.body },
        $inc: { __v: 1 }
      },
      { new: true }
    );

    response.status(200).json({ message: "Comment updated" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
};


//React to a post
const reaction = async (request, response) => {
  const postId = request.params.id;
  const userId = request.user._id;
  const reactionType = request.body.reactionType;

  let emptyFields = [];

  if (!reactionType) {
    emptyFields.push('reactionType');
  }

  if (emptyFields.length > 0) {
    return response.status(400).json({ error: 'Please select a reaction', emptyFields });
  }

  if (!mongoose.isValidObjectId(postId)) {
    return response.status(404).json({ error: "Incorrect ID" });
  }

  const allowedReactions = ["Like", "Love", "Care", "Haha", "Wow", "Sad", "Angry"];
  if (!allowedReactions.includes(reactionType)) {
    return response.status(400).json({ error: "Invalid reaction type" });
  }

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return response.status(404).json({ error: "No such post" });
    }


    const existingReactionIndex = post.reactions.findIndex(
      (reaction) => reaction.userId.toString() === userId.toString()
    );

    if (existingReactionIndex !== -1) {

      post.reactions[existingReactionIndex].reactionType = reactionType;
    } else {

      post.reactions.push({ userId, reactionType });
      post.reactionCount++;  
    }

    await post.save();
    return response.status(201).json({ message: "Reaction added or updated" });
  } catch (error) {
    response.status(500).json({ error: "Cannot react" });
  }
};

//React to a comment

const commentReaction = async (request, response) => {
  const commentId = request.params.id;
  const userId = request.user._id;
  const reactionType = request.body.reactionType;

  let emptyFields = [];

  if (!reactionType) {
    emptyFields.push('reactionType');
  }

  if (emptyFields.length > 0) {
    return response.status(400).json({ error: 'Please select a reaction', emptyFields });
  }

  if (!mongoose.isValidObjectId(commentId)) {
    return response.status(404).json({ error: "Incorrect ID" });
  }

  const allowedReactions = ["Like", "Love", "Care", "Haha", "Wow", "Sad", "Angry"];
  if (!allowedReactions.includes(reactionType)) {
    return response.status(400).json({ error: "Invalid reaction type" });
  }

  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return response.status(404).json({ error: "No such post" });
    }


    const existingReactionIndex = comment.reactions.findIndex(
      (reaction) => reaction.userId.toString() === userId.toString()
    );

    if (existingReactionIndex !== -1) {

      comment.reactions[existingReactionIndex].reactionType = reactionType;
    } else {

      comment.reactions.push({ userId, reactionType });
      comment.reactionCount++;  
    }

    await comment.save();
    return response.status(201).json({ message: "Reaction added or updated" });
  } catch (error) {
    response.status(500).json({ error: "Cannot react" });
  }
};


module.exports = { createPost, deletePost, updatePost, createComment, deleteComment, updateComment, reaction, commentReaction};