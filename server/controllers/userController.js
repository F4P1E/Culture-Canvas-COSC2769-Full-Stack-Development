const userModel = require("../models/userModel");

const loginUser = async (request, response) => {
	const { email, password } = request.body;

	const user = await userModel.findOne({ email: email });
	console.log(
		`- id: ${user._id}\n- username: ${user.username}\n- email: ${email}\n`
	);

	try {
		const user = await userModel.login(email, password);

		request.session._id = user._id;
		request.session.email = email;

		const userPayload = { ...user._doc, password: undefined };

		response.status(200).json(userPayload);
	} catch (error) {
		if (error instanceof Error) {
			response.status(400).json({ error: error.message });
		} else {
			response.status(400).json({ error: "An unknown error occurred" });
		}
	}
};

const signupUser = async (request, response) => {
	const { username, email, password } = request.body;

	console.log(
		`- username: ${username}\n- email: ${email}\n- password: *****\n`
	);

	try {
		const user = await userModel.signup(username, email, password);

		request.session._id = user._id;
		request.session.email = email;

		response
			.status(200)
			.json(`Signed up successfully as ${email} with username ${username}`);
	} catch (error) {
		if (error instanceof Error) {
			response.status(400).json({ error: error.message });
		} else {
			response.status(400).json({ error: "An unknown error occurred" });
		}
	}
};

const sendFriendRequest = async (request, response) => {
	try {
		if (request.user._id !== request.params.id) {
			const sender = await userModel.findById(request.user._id);
			const receiver = await userModel.findById(request.params.id);

			if (!sender || !receiver) {
				response.status(404).json({ error: "User not found" });
				return;
			}

			if (
				!receiver.requests.includes(sender._id) &&
				!receiver.friends.includes(sender._id)
			) {
				await receiver.updateOne({
					$push: { requests: sender._id },
				});

				response.json({ message: "Friend request sent successfully" });
			} else {
				response.status(400).json({
					error: "You have already sent a friend request to this user",
				});
			}
		} else {
			response
				.status(400)
				.json({ error: "You cannot send a friend request to yourself" });
		}
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

const viewFriendList = async (request, response) => {
	try {
		const user = await userModel
			.findById(request.params.id)
			.populate("friends");

		if (!user) {
			return response.status(404).send("User not found");
		}

		response.status(200).json(user.friends);
	} catch (error) {
		response.status(500).send("Error fetching friends");
	}
};


const cancelFriendRequest = async (request, response) => {
	try {
		if (request.user._id !== request.params.id) {
			const sender = await userModel.findById(request.params.id);
			const receiver = await userModel.findById(request.user._id);

			if (!sender || !receiver) {
				response.status(404).json({ error: "User not found" });
				return;
			}

			if (receiver.requests.includes(sender._id)) {
				await receiver.updateOne({
					$pull: { requests: sender._id },
				});

				response.json({ message: "Friend request cancel successfully" });
			} else {
				response.status(400).json({ error: "Request already cancelled" });
			}
		} else {
			response
				.status(400)
				.json({ error: "You cannot cancel a friend request sent to yourself" });
		}
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

const acceptFriendRequest = async (request, response) => {
	try {
		if (request.user._id !== request.params.id) {
			const receiver = await userModel.findById(request.user._id);
			const sender = await userModel.findById(request.params.id);

			if (!sender || !receiver) {
				response.status(404).json({ error: "User not found" });
				return;
			}

			if (receiver.requests.includes(sender._id)) {
				await receiver.updateOne({
					$push: { friends: sender._id },
				});
				await sender.updateOne({
					$push: { friends: receiver._id },
				});
				await receiver.updateOne({
					$pull: { requests: sender._id },
				});

				response.json({ message: "Friend request accepted" });
			} else {
				response.status(400).json({ error: "Already accepted this request" });
			}
		} else {
			response
				.status(400)
				.json({ error: "You cannot accept a friend request sent to yourself" });
		}
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

const unFriend = async (request, response) => {
	try {
		if (request.user._id !== request.params.id) {
			const sender = await userModel.findById(request.user._id);
			const receiver = await userModel.findById(request.params.id);

			if (!sender || !receiver) {
				response.status(404).json({ error: "User not found" });
				return;
			}

			if (
				receiver.friends.includes(sender._id) &&
				sender.friends.includes(receiver._id)
			) {
				await receiver.updateOne({
					$pull: { friends: sender._id },
				});
				await sender.updateOne({
					$pull: { friends: receiver._id },
				});

				response.json({ message: "Unfriended" });
			} else {
				response.status(400).json({ error: "You are not friends" });
			}
		} else {
			response.status(400).json({ error: "Cannot unfriend yourself" });
		}
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};


//GET TOTAL USERS
const getUserCount = async (req, res) => {
	try {
	  const count = await userModel.countDocuments();
	  res.status(200).json({ totalUsers: count });
	} catch (error) {
	  console.error('Error fetching user count:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };
  


//GET REQUESTS

const getStrangers = async (request, response) => {
	console.log("Testing");
	try {
		const user = await userModel.findById(request.params.id);
		if (!user) {
			response.status(404).json({ error: "User not found" });
			return;
		}

		const strangers = await userModel.find({
			_id: { $nin: user.friends },
		});

		const strangerUsernames = strangers.map((stranger) => stranger);
		response.json(strangerUsernames);
	} catch {
		response.status(500).json({ error: "Internal server error" });
	}
};

const getFriends = async (request, response) => {
  try {
    const user = await UserModel.findById(request.user._id).populate('friends', 'username');
    if (!user) {
      response.status(404).json({ error: 'User not found' });
      return;
    }
    
    const friends = user.friends.map(friend => friend.username);
    response.json(friends);
    
  } catch {
    response.status(500).json({ error: 'Internal server error' });
  }
}


// Get group requests (for admins)
const getFriendRequest = async (req, res) => {
	const userId = req.user._id;

	
};

// Get all post

const getPosts = async (request, response) => {
  try {
    const userId = request.user.id; 
    const user = await UserModel.findById(userId);
    if (!user) {
      response.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const friendIds = user.friends.map(friend => friend.toString());
    friendIds.push(userId); 

    const posts = await postModel.find({
      $or: [
        { userId: { $in: friendIds } },
        { visibility: 'public' } 
      ]
    }).select('-oldVersions').exec();

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

const getPostsFromSpecificUser = async (request, response) => {
  try {
    const userId = request.params.id;
    const posts = await postModel.find({ userId }).sort({ createdAt: -1 }).exec();
    response.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    response.status(500).json({ status: 'error', message: 'Failed to retrieve posts from user' });
  }
};

// Get edit history
const getEditHistory = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      response.status(404).json({ error: "Incorrect ID" });
    }

    const post = await postModel.findOne({ _id: id });
    
    if (!post) {
      return response.status(400).json({ error: "No such post" });
    }

    const editHistory = post.oldVersions;

    response.status(200).json(editHistory);
}

//View all comment from a post

const getCommentsFromPost = async (request, response) => {
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
const getCommentEditHistory = async (request, response) => {
    const commentId = request.params.id;

    if (!mongoose.isValidObjectId(commentId)) {
      response.status(404).json({ error: "Incorrect ID" });
    }

    const comment = await commentModel.findOne({ _id: commentId });

    if (!comment) {
      return response.status(400).json({ error: "No such comment" });
    }

    const editHistory = comment.oldVersions;

    response.status(200).json(editHistory);
};

//Suspense user accoungt

const suspendAccount = async (request, response) => {
  try {
    const userId = request.params.id;
    const adminId = request.user._id;
    const adminRole = (await UserModel.findOne({ _id: adminId })).role;

    if (!mongoose.isValidObjectId(userId)) {
      return response.status(404).json({ error: "Incorrect ID" });
    }

    if (!adminId || adminRole !== "Admin") {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return response.status(400).json({ error: "No such user" });
    }

    let newStatus;
    if (user.status === "Suspended") {
      newStatus = "Normal";
      await UserModel.findOneAndUpdate({ _id: userId }, { $set: { status: newStatus } });
      response.status(200).json({ message: "User account resumed" });
    } else {
      newStatus = "Suspended";
      await UserModel.findOneAndUpdate({ _id: userId }, { $set: { status: newStatus } });
      response.status(200).json({ message: "User account suspended" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
};

module.exports = {
	loginUser,
	signupUser,
	viewFriendList,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	getStrangers,
	unFriend,
	getFriends,
	getPosts,
	getPostsFromSpecificUser,
	getCommentEditHistory,
	getCommentsFromPost,
	getEditHistory,
	suspendAccount

};
