const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const groupModel = require("../models/groupModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

// Create new post
const createPost = async (request, response) => {
	const { content, reactions, reactionCount, visibility, comments, groupId } =
		request.body;

	let emptyFields = [];

	if (!content) {
		emptyFields.push("content");
	}

	if (
		visibility &&
		visibility !== "public" &&
		visibility !== "friendsOnly" &&
		visibility !== "private"
	) {
		return response.status(400).json({ error: "Invalid visibility" });
	}

	if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
		return response.status(400).json({ error: "Invalid group ID" });
	}

	if (emptyFields.length > 0) {
		return response
			.status(400)
			.json({ error: "Please fill in all the fields", emptyFields });
	}

	try {
		// Get user ID and username
		const userId = request.user._id;
		const user = await userModel.findById(userId);
		const username = user.username;

		if (groupId) {
			const group = await groupModel.findById(groupId);
			if (!group) {
				return response.status(404).json({ error: "Group not found" });
			}
		} else {
			if (
				!visibility ||
				(visibility !== "public" && visibility !== "friendsOnly")
			) {
				return response
					.status(400)
					.json({ error: "Invalid visibility setting" });
			}
		}

		// Create the new post
		const newPost = await postModel.create({
			userId,
			username,
			content,
			reactions,
			reactionCount,
			visibility,
			comments,
			groupId,
		});

		// Add the post to the group
		if (groupId) {
			const group = await groupModel.findByIdAndUpdate(groupId, {
				$push: { posts: newPost._id },
			});
			if (!group) {
				return response.status(404).json({ error: "Group not found" });
			}

			return response.status(201).json(newPost);
		} else {
			return response.status(201).json(newPost);
		}
	} catch (error) {
		return response.status(500).json({ error: "Server error", message: error });
	}
};

// Get all posts
const getPosts = async (request, response) => {
	// // Shuffle posts array
	// for (let i = posts.length - 1; i >= 0; i--) {
	// 	const j = Math.floor(Math.random() * (i + 1));
	// 	[posts[i], posts[j]] = [posts[j], posts[i]];
	// }

	try {
		const userId = request.user._id;
		const user = await userModel.findById(userId);
		const userFriendIds = user.friends;
		const groupId = request.headers["group-id"];

		if (groupId) {
			const group = await groupModel.findById(groupId);
			if (!group) {
				return response.status(404).json({ error: "Group not found" });
			}

			// Find posts in the group
			const { posts } = await groupModel.findById(groupId).populate({
				path: "posts",
				select: "-oldVersions",
				options: { sort: { createdAt: -1 } },
			});

			response.status(200).json(posts);
		} else {
			// Find public posts or friends-only posts where the user is a friend of the post's author
			const posts = await postModel
				.find({
					$or: [
						{ visibility: "public" },
						{
							visibility: "friendsOnly",
							userId: { $in: userFriendIds },
						},
						{
							visibility: "friendsOnly",
							userId: { $in: userId },
						},
					],
				})
				.select("-oldVersions")
				.sort({ createdAt: -1 })
				.exec();

			response.status(200).json(posts);
		}
	} catch (error) {
		response.status(500).json({
			status: "error",
			message: "Failed to retrieve posts",
		});
	}
};

// Get all posts from a group
const getGroupPosts = async (request, response) => {};

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
		response.status(200).json(post);
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
	const postId = request.params.id;
	const postContent = request.body.content;

	if (!mongoose.isValidObjectId(postId)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const post = await postModel.findOneAndUpdate(
			{ _id: postId },
			{
				$set: { content: postContent },
				$inc: { __v: 1 },
			},
			{ upsert: true, new: true }
		);

		if (!post) {
			return response.status(400).json({ error: "No such post" });
		}

		response.status(200).json(post);
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
				const commentUser = await userModel.findById(comment.userId); // Get the user name from the comment
				commentLocal = comment.toObject(); // Convert Mongo docs into JS objects
				commentLocal.username = commentUser.username; // Update the local comment object with the username

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
	const userId = request.user._id;
	const postId = request.params.id;
	const commentId = request.params.commentId;
	const content = request.body.content;

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
				$set: { content },
				$inc: { __v: 1 },
			},
			{ new: true }
		);

		if (!comment) {
			return response.status(400).json({ error: "No such comment" });
		}

		// Check if the user is the author
		console.log(`userId: ${userId}, comment.userId: ${comment.userId}`);
		if (JSON.stringify(userId) !== JSON.stringify(comment.userId)) {
			return response
				.status(400)
				.json({ error: "You are not the author of this comment" });
		}

		response.status(200).json(comment);
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

// Get all comments from a post
const getPostComment = async (request, response) => {
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

// Get edit history
const getPostHistory = async (request, response) => {
	const postId = request.params.id;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(postId)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const post = await postModel.findOne({ _id: postId });

		if (!post) {
			return response.status(400).json({ error: "No such post" });
		}

		const postHistory = post.oldVersions;

		response.status(200).json(postHistory);
	} catch (error) {
		response.status(500).json({ error: "Failed to retrieve post history" });
	}
};

// Get comment edit history
const getCommentHistory = async (request, response) => {
	const commentId = request.params.id;

	if (!mongoose.isValidObjectId(commentId)) {
		return response.status(404).json({ error: "Incorrect ID" });
	}

	try {
		const comment = await commentModel.findById(commentId);

		if (!comment) {
			return response.status(404).json({ error: "No such comment" });
		}

		const commentHistory = comment.oldVersions;

		response.status(200).json(commentHistory);
	} catch (error) {
		response.status(500).json({ error: "Failed to retrieve comment history" });
	}
};

// Add reaction to a post
const postReaction = async (req, res) => {
	try {
		const postId = req.params.id;
		const { reactionType } = req.body; // Reaction type (like, love, haha, angry)
		const userId = req.user._id;

		// Find the post
		const post = await postModel.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Ensure the reactionType is valid based on the schema
		if (!["like", "love", "haha", "angry"].includes(reactionType)) {
			return res.status(400).json({ message: "Invalid reaction type" });
		}

		// Check if the user has already reacted with the given type
		const hasReacted = post.reactions[reactionType].some(
			(reaction) => reaction.user.toString() === userId.toString()
		);

		if (hasReacted) {
			// Remove the user's reaction
			post.reactions[reactionType] = post.reactions[reactionType].filter(
				(reaction) => reaction.user.toString() !== userId.toString()
			);
		} else {
			// Remove the user from any previous reactions
			Object.keys(post.reactions).forEach((key) => {
				post.reactions[key] = post.reactions[key].filter(
					(reaction) => reaction.user.toString() !== userId.toString()
				);
			});

			// Add the user to the new reaction type
			post.reactions[reactionType].push({ user: userId });
		}

		// Update reactionCount by counting all reactions across types
		const totalReactions = Object.values(post.reactions).reduce(
			(acc, reactionArray) => acc + reactionArray.length,
			0
		);
		post.reactionCount = totalReactions;

		await post.save();

		// Populate user details in reactions
		const populatedPost = await postModel
			.findById(postId)
			.populate("reactions.like.user")
			.populate("reactions.love.user")
			.populate("reactions.haha.user")
			.populate("reactions.angry.user");

		// Return the updated post with populated user details
		res.json({
			message: "Reaction updated",
			reactionCount: populatedPost.reactionCount,
			reactions: populatedPost.reactions,
		});
	} catch (error) {
		console.error("Failed to update reaction:", error);
		res.status(500).json({ message: "Server error" });
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
	getGroupPosts,
	getPostsFromSpecificUser,
	getSpecificPost,
	deletePost,
	updatePost,
	getPostHistory,
	getPostComments,
	createComment,
	deleteComment,
	updateComment,
	getPostComment,
	getCommentHistory,
	postReaction,
	commentReaction,
};
