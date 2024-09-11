const userModel = require("../models/userModel");
const mongoose = require("mongoose");

// Get all posts
const getUsers = async (request, response) => {
	try {
		const users = await userModel.find({}).exec();

		response.status(200).json(users);
	} catch (error) {
		response
			.status(500)
			.json({ status: "error", message: "Failed to retrieve posts" });
	}
};

const suspendResumeUser = async (request, response) => {
	const suspendId = request.params.id;
	const userId = request.user._id;

	try {
		const suspendUser = await userModel.findById(suspendId);
		if (!suspendUser) {
			return response.status(404).json({ error: "User not found" });
		}

		const user = await userModel.findById(userId);

		// Check if user is an admin
		if (!user.admin) {
			return response
				.status(403)
				.json({ error: "Only admins can suspend users" });
		}

		// Check if the suspendId is yourself
		if (suspendUser === user) {
			return response
				.status(403)
				.json({ error: "You cannot suspend yourself" });
		}

		// Check if the suspendId is of an admin
		if (suspendUser.admin) {
			return response
				.status(403)
				.json({ error: "You cannot suspend an admin" });
		}

		// Check if the suspendId is suspended
		if (suspendUser.suspended) {
			// Unsuspend the user
			suspendUser.suspended = false;
			await suspendUser.save();

			response.status(200).json({ message: "User resumed successfully" });
		} else {
			// Suspend the user
			suspendUser.suspended = true;
			await suspendUser.save();

			response.status(200).json({ message: "User suspended successfully" });
		}
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

const loginUser = async (request, response) => {
	const { email, password } = request.body;

	const user = await userModel.findOne({ email: email });
	if (!user) {
		response.status(404).json({ error: "User not found" });
		return;
	}
	console.log(
		`- id: ${user._id}\n- username: ${user.username}\n- email: ${email}\n`
	);

	// Check if user is suspended
	if (user.suspended) {
		response.status(403).json({ error: "User is suspended" });
		return;
	}

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

// Get friend requests
const viewFriendRequest = async (req, res) => {
	const userId = req.user._id;

	try {
		const user = await userModel.findById(userId).populate("requests");

		res.status(200).json(user.requests);
	} catch (error) {
		res.status(500).json("Cannot get friend request: ", error);
	}
};

const sendFriendRequest = async (request, response) => {
	try {
		if (request.user._id != request.params.id) {
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

const getStrangers = async (request, response) => {
	try {
		const user = await userModel.findById(request.params.id);
		if (!user) {
			response.status(404).json({ error: "User not found" });
			return;
		}

		const strangers = await userModel.find({
			_id: { $nin: user.friends, $ne: user._id },
		});

		const strangerUsernames = strangers.map((stranger) => stranger);
		response.json(strangerUsernames);
	} catch {
		response.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getUsers,
	suspendResumeUser,
	loginUser,
	signupUser,
	viewFriendList,
	viewFriendRequest,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	getStrangers,
	unFriend,
};
