const groupModel = require("../models/groupModel");
const userModel = require("../models/userModel");

const mongoose = require("mongoose");

// Get all groups that has not been joined
const getGroups = async (req, res) => {
	const userId = req.user._id;

	try {
		const user = await userModel.findById(userId).populate("groups").exec();
		if (user && Array.isArray(user.groups)) {
			const groupIdWithUser = user.groups.map((group) => group._id);
			console.log("- groupIdWithUser:", groupIdWithUser);

			const groups = await groupModel.find({
				_id: { $nin: groupIdWithUser },
			});

			res.status(200).json(groups);
		} else {
			console.log([]);
		}
	} catch (err) {
		// handle the error
		console.error(err);
		res.status(500).send("Error fetching groups");
	}
};

// Get all groups that has been joined
const getUserGroups = async (req, res) => {
	const userId = req.user._id;

	try {
		const user = await userModel.findById(userId).populate("groups").exec();
		if (user && Array.isArray(user.groups)) {
			const groupIdWithUser = user.groups.map((group) => group._id);
			console.log("- groupIdWithUser:", groupIdWithUser);

			const groups = await groupModel.find({
				_id: { $in: groupIdWithUser },
			});

			res.status(200).json(groups);
		} else {
			console.log([]);
		}
	} catch (err) {
		// handle the error
		console.error(err);
		res.status(500).send("Error fetching groups");
	}
};

// Create a new group
const createGroup = async (req, res) => {
	const { name } = req.body;
	const userId = req.user._id;

	// Check if the name is provided
	if (!name) {
		return res.status(400).json({ error: "Name is required" });
	}

	// Create the group
	const group = await groupModel.create({ name });

	// Add user to the group member and admin
	await groupModel.findByIdAndUpdate(group._id, {
		$push: { members: userId, admins: userId },
	});

	// Add group to user
	await userModel.findByIdAndUpdate(userId, {
		$push: { groups: group._id },
	});

	res.status(200).json({ message: "Group created successfully", group });
};

// Request to join group
const requestJoinGroup = async (req, res) => {
	const userId = req.user._id;
	const groupId = req.params.id;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(groupId)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	try {
		// Find the group
		const group = await groupModel.findById(groupId);
		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Check if the user is already a member
		if (group.members.includes(userId)) {
			return res
				.status(400)
				.json({ error: "You are already a member of this group" });
		}

		// Check if a request has already been sent
		if (group.requests.includes(userId)) {
			return res
				.status(400)
				.json({ error: "You have already sent a join request to this group" });
		}

		// Send join request
		await groupModel.findByIdAndUpdate(groupId, {
			$push: { requests: userId },
		});

		res.status(200).json({ message: "Join request sent successfully", group });
	} catch (err) {
		// handle the error
		console.error(err);
		res.status(500).send("Error sending join request");
	}
};

// Approve join request
const approveJoinGroup = async (req, res) => {
	const userId = req.user._id;
	const groupId = req.params.id;
	const requestId = req.params.requestId;

	// Check if the ID is valid
	if (
		!mongoose.isValidObjectId(groupId) ||
		!mongoose.isValidObjectId(requestId)
	) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(groupId);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Find the request
	const request = group.requests.find(
		(request) => request.toString() === requestId
	);
	if (!request) {
		return res.status(404).json({ error: "Request not found" });
	}

	// Check if approver is an admin
	if (!group.admins.includes(userId)) {
		return res.status(403).json({ error: "Only admins can approve requests" });
	} else {
		// Approve the request
		group.members.push(requestId);
		group.requests.splice(group.requests.indexOf(requestId), 1);
		await group.save();

		// Add group to user
		await userModel.findByIdAndUpdate(requestId, {
			$push: { groups: groupId },
		});

		res.status(200).json({ message: "Request approved successfully", group });
	}
};

// Delete user from group
const deleteMemberFromGroup = async (req, res) => {
	const userId = req.user._id;
	const groupId = req.params.id;
	const deleteId = req.params.userId;

	// Check if the ID is valid
	if (
		!mongoose.isValidObjectId(groupId) ||
		!mongoose.isValidObjectId(deleteId)
	) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(groupId);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Find the user
	const user = await userModel.findById(deleteId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	// Check if user is an admin
	if (!group.admins.includes(userId)) {
		return res.status(403).json({ error: "Only admins can delete members" });
	} else {
		// Remove the user from the group
		await groupModel.findByIdAndUpdate(groupId, {
			$pull: { members: deleteId },
		});

		// Remove the group from the user
		await userModel.findByIdAndUpdate(deleteId, {
			$pull: { groups: groupId },
		});

		res.status(200).json({ message: "User removed from group successfully" });
	}
};

module.exports = {
	getGroups,
	getUserGroups,
	createGroup,
	requestJoinGroup,
	approveJoinGroup,
	deleteMemberFromGroup,
};
