const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const mongoose = require("mongoose");

// Create new post
const createPost = async (request, response) => {
	const { username, content, reactions, reactionCount, visibility, comments } =
		request.body;

	let emptyFields = [];

	if (!username) {
		emptyFields.push("username");
	}
	if (!content) {
		emptyFields.push("content");
	}

	if (visibility && visibility !== "public" && visibility !== "friendsOnly") {
		return response.status(400).json({ error: "Invalid visibility" });
	}

	if (emptyFields.length > 0) {
		return response
			.status(400)
			.json({ error: "Please fill in all the fields", emptyFields });
	}

	try {
		const userId = request.user?._id;
		if (!userId) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		// Create the new post
		const newPost = new postModel({
			userId,
			username,
			content,
			reactions,
			reactionCount,
			visibility,
			comments,
		});

		await newPost.save();
		return response.status(201).json(newPost);
	} catch (error) {
		return response.status(500).json({ error: "Server error" });
	}
};

// Get all posts
const getPosts = async (request, response) => {
	try {
		const posts = await postModel.find({}).select("-oldVersions").exec();

		for (let i = posts.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[posts[i], posts[j]] = [posts[j], posts[i]];
		}

		response.status(200).json({ status: "success", data: posts });
	} catch (error) {
		response
			.status(500)
			.json({ status: "error", message: "Failed to retrieve posts" });
	}
};

// Get all posts from a user
const getPostsFromSpecificUser = async (request, response) => {
	try {
		const userId = request.params.id;
		const posts = await postModel
			.find({ userId })
			.sort({ createdAt: -1 })
			.exec();
		response.status(200).json({ status: "success", data: posts });
	} catch (error) {
		response
			.status(500)
			.json({ status: "error", message: "Failed to retrieve posts from user" });
	}
};

// Get a single post
const getSpecificPost = async (request, response) => {
	const { id } = request.params;
	if (!mongoose.isValidObjectId(id)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}
	try {
		const post = await postModel.findById(id).populate("comments").exec();
		if (!post) {
			return response.status(404).json({ error: "Post not found" });
		}
		response.status(200).json({ status: "success", data: post });
	} catch (error) {
		response
			.status(500)
			.json({ status: "error", message: "Failed to retrieve post" });
	}
};

// Delete a post
const deletePost = async (request, response) => {
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
const updatePost = async (request, response) => {
	const { id } = request.params;

	if (!mongoose.isValidObjectId(id)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const post = await postModel.findOneAndUpdate(
			{ _id: id },
			{
				$set: { ...request.body },
				$inc: { __v: 1 },
			},
			{ upsert: true, new: true }
		);

		if (!post) {
			return response.status(400).json({ error: "No such post" });
		}

		response.status(200).json({ message: "Post updated" });
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

// Get edit history
const getEditHistory = async (request, response) => {
	const { id } = request.params;

	if (!mongoose.isValidObjectId(id)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const post = await postModel.findOne({ _id: id });

		if (!post) {
			return response.status(400).json({ error: "No such post" });
		}

		const editHistory = post.oldVersions;

		response.status(200).json(editHistory);
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

const getPostComments = async (request, response) => {
    const postId = request.params.id;

    // Check if the ID is valid
    if (!mongoose.isValidObjectId(postId)) {
        return response.status(404).json({ error: "Incorrect ID" });
    }

    try {
        // Get the post and populate the comments
        const post = await postModel.findById(postId).populate("comments");

        // Collect updated comments
        const commentsWithUsernames = await Promise.all(
            post.comments.map(async (comment) => {                
                const commentUser = await userModel.findById(comment.userId);	// Get the user name from the comment
                commentLocal = comment.toObject();	 // Convert Mongo docs into JS objects
	            commentLocal.username = commentUser.username;	// Update the local comment object with the username

                return commentLocal;
            })
        );

        // Send the response with the updated comments
        response.status(200).json(commentsWithUsernames);
    } catch (error) {
        response.status(500).json({ error: "Failed to retrieve comments" });
    }
};

const createComment = async (request, response) => {
	try {
		const { content, reactions = [], reactionCount = 0 } = request.body;
		const postId = request.params.id;
		const userId = request.user._id;

		// Validate content
		if (!content) {
			return response.status(400).json({ error: "Content is required" });
		}

		// Create the comment
		const comment = await commentModel.create({
			postId,
			userId,
			content,
			reactions, // This can be an empty array, and that's valid.
			reactionCount,
		});

		// Update the post with the new comment
		const updatedPost = await postModel.findByIdAndUpdate(
			postId,
			{
				$push: { comments: comment._id },
				$inc: { commentCount: 1 },
			},
			{ new: true }
		);

		// Send the response with the created comment and updated post
		response.status(200).json({ comment, post: updatedPost });
	} catch (error) {
		console.error("Error creating comment:", error);
		response
			.status(400)
			.json({ error: "Cannot create comment", details: error.message });
	}
};

// Delete comment
const deleteComment = async (request, response) => {
	const postId = request.params.postId;
	const commentId = request.params.commentId;

	if (
		!mongoose.isValidObjectId(postId) ||
		!mongoose.isValidObjectId(commentId)
	) {
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
				$inc: { commentCount: -1 },
			},
			{ new: true }
		);

		if (!post) {
			return response
				.status(400)
				.json({ error: "No associated post found for this comment" });
		}

		response.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

// Update comment
const updateComment = async (request, response) => {
	const postId = request.params.postId;
	const commentId = request.params.commentId;

	if (
		!mongoose.isValidObjectId(postId) ||
		!mongoose.isValidObjectId(commentId)
	) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const comment = await commentModel.findOneAndUpdate(
			{ _id: commentId },
			{
				$set: { ...request.body },
				$inc: { __v: 1 },
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

// Get all comments from a post
const getCommentsFromPost = async (request, response) => {
	const { id } = request.params;

	if (!mongoose.isValidObjectId(id)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const post = await postModel.findById(id).populate("comments").exec();

		if (!post) {
			return response.status(404).json({ error: "No such post" });
		}

		response.status(200).json({ comments: post.comments });
	} catch (error) {
		response.status(500).json({ error: "Failed to retrieve comments" });
	}
};

// Get comment edit history
const getCommentEditHistory = async (request, response) => {
	const { id } = request.params;

	if (!mongoose.isValidObjectId(id)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const comment = await commentModel.findById(id);

		if (!comment) {
			return response.status(404).json({ error: "No such comment" });
		}

		const editHistory = comment.oldVersions;

		response.status(200).json(editHistory);
	} catch (error) {
		response
			.status(500)
			.json({ error: "Failed to retrieve comment edit history" });
	}
};

// Add reaction to a post
const reaction = async (request, response) => {
	const { id } = request.params;
	const { reactionType } = request.body;
	const userId = request.user._id;

	if (!mongoose.isValidObjectId(id)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	if (!reactionType) {
		return response.status(400).json({ error: "Reaction type is required" });
	}

	try {
		const post = await postModel.findById(id);

		if (!post) {
			return response.status(404).json({ error: "No such post" });
		}

		// Check if user already reacted
		const existingReaction = post.reactions.find(
			(r) => r.userId.toString() === userId.toString()
		);

		if (existingReaction) {
			// Update existing reaction
			existingReaction.reactionType = reactionType;
		} else {
			// Add new reaction
			post.reactions.push({ userId, reactionType });
		}

		post.reactionCount = post.reactions.length;
		await post.save();

		response.status(200).json(post);
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

// Add reaction to a comment
const commentReaction = async (request, response) => {
	const { postId, commentId } = request.params;
	const { reactionType } = request.body;
	const userId = request.user._id;

	if (
		!mongoose.isValidObjectId(postId) ||
		!mongoose.isValidObjectId(commentId)
	) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	if (!reactionType) {
		return response.status(400).json({ error: "Reaction type is required" });
	}

	try {
		const comment = await commentModel.findById(commentId);

		if (!comment) {
			return response.status(404).json({ error: "No such comment" });
		}

		// Check if user already reacted
		const existingReaction = comment.reactions.find(
			(r) => r.userId.toString() === userId.toString()
		);

		if (existingReaction) {
			// Update existing reaction
			existingReaction.reactionType = reactionType;
		} else {
			// Add new reaction
			comment.reactions.push({ userId, reactionType });
		}

		comment.reactionCount = comment.reactions.length;
		await comment.save();

		// Optionally update the post's comment reactions count
		await postModel.findByIdAndUpdate(
			postId,
			{ $inc: { commentReactionCount: 1 } },
			{ new: true }
		);

		response.status(200).json(comment);
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	createPost,
	getPosts,
	getPostsFromSpecificUser,
	getSpecificPost,
	deletePost,
	updatePost,
	getEditHistory,
	getPostComments,
	createComment,
	deleteComment,
	updateComment,
	getCommentsFromPost,
	getCommentEditHistory,
	reaction,
	commentReaction,
};
