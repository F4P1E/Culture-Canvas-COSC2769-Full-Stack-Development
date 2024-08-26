import User from "../models/User.js";

// Read
// Get a user
export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json(user);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};

// Get a user's friends
export const getUserFriends = async (req, res) => {
	try {
		// Get the user's ID
		const { id } = req.params;
		const user = await User.findById(id);

		// Get the user's friends
		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
		);

		// Format the response for front-end
		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);

		res.status(200).json(formattedFriends);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};

// Update
// Add or remove a friend
export const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id); // Get the user
		const friend = await User.findById(friendId); // Get the user's friend

		// Check if they are already friends
		if (user.friends.includes(friendId)) {
			// Remove friend if already friends
			user.friends = user.friends.filter((id) => id !== friendId);
			friend.friends = friend.friends.filter((id) => id !== id);
		} else {
			// Add friend if not
			user.friends.push(friendId);
			friend.friends.push(id);
		}
		await user.save();
		await friend.save();

		// Get the updated friends
		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
		);

		// Format the response for front-end
		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);

		res.status(200).json(formattedFriends);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};
