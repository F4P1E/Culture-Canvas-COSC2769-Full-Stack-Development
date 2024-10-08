const groupModel = require("../models/groupModel");
const groupRequestModel = require("../models/groupRequestModel");
const userModel = require("../models/userModel");

const mongoose = require("mongoose");

// Get groups that has NOT been joined
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

const getOneGroup = async (req, res) => {
	const groupId = req.params.id;
	const PopulateMember = req.header("Populate-Member");

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(groupId)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	try {
		if (PopulateMember == "true") {
			// Get group with populating member
			const group = await groupModel
				.findById(groupId)
				.populate("members")
				.exec();
			if (!group) {
				return res.status(404).json({ error: "Group not found" });
			}
			res.status(200).json(group);
		} else {
			// Get group without populating member
			const group = await groupModel.findById(groupId);
			if (!group) {
				return res.status(404).json({ error: "Group not found" });
			}
			res.status(200).json(group);
		}
	} catch (error) {
		res.status(500).json("Cannot get the group: ", error);
	}
};

// Get groups that has been joined
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

// Get groups that has been joined with admin privilege
const getAdminGroups = async (req, res) => {
	const userId = req.user._id;

	try {
		const user = await userModel.findById(userId).populate("groups").exec();
		if (user && Array.isArray(user.groups)) {
			const groupIdWithUserAsAdmin = user.groups
				.filter((group) => group.admins.includes(userId))
				.map((group) => group._id);
			console.log("- groupIdWithUserAsAdmin:", groupIdWithUserAsAdmin);

			const groups = await groupModel.find({
				_id: { $in: groupIdWithUserAsAdmin },
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

// Get group requests (for admins)
const getGroupRequests = async (req, res) => {
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

		// Check if the user is an admin
		if (!group.admins.includes(userId)) {
			return res.status(403).json({ error: "Only admins can view requests" });
		} else {
			// If the user is an admin, populate requests and return them
			await group.populate("requests");
			res.status(200).json(group.requests);
		}
	} catch (error) {
		res.status(500).json("Cannot get group join request: ", error);
	}
};

// Get group members
// const getGroupMembers = async (req, res) => {
// 	const groupId = req.params.id;

// 	// Check if the ID is valid
// 	if (!mongoose.isValidObjectId(groupId)) {
// 		return res.status(404).json({ error: "Incorrect ID" });
// 	}

// 	try {
// 		// Find the group
// 		const group = await groupModel.findById(groupId);
// 		if (!group) {
// 			return res.status(404).json({ error: "Group not found" });
// 		}

// 		// Populate members and return them
// 		await group.populate("members");
// 		res.status(200).json(group.members);
// 	} catch (error) {
// 		res.status(500).json("Cannot get group members: ", error);
// 	}
// };

// Create a new group
const approveCreateGroup = async (req, res) => {
	const userId = req.user._id;
	const groupRequestId = req.params.id;

	try {
		// Check if the user is an admin
		const user = await userModel.findById(userId);
		if (!user.admin) {
			return res
				.status(403)
				.json({ message: "Only admins can approve group requests" });
		}

		// Find the group request by ID
		const groupRequest = await groupRequestModel.findById(groupRequestId);
		console.log(
			`- groupRequest: ${await groupRequestModel.findById(groupRequestId)}`
		);

		if (!groupRequest) {
			return res.status(404).json({ message: "Group request not found" });
		}

		// Call the approveRequest method on the group request document
		const newGroup = await groupRequest.approveRequest();

		// Return success response with the newly created group
		return res.status(200).json({
			message: "Group request approved and group created successfully",
			group: newGroup,
		});
	} catch (err) {
		// Handle any errors that occurred during the process
		return res.status(500).json({
			message: "Error approving group request",
			error: err.message,
		});
	}
};

// Request to create group
const requestCreateGroup = async (req, res) => {
	const { name } = req.body;
	const userId = req.user._id;

	try {
		// Check if the name is provided
		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}

		// Create the group request
		const group = await groupRequestModel.create({ name });

		// Add user to the group member and admin
		await groupRequestModel.findByIdAndUpdate(group._id, {
			$push: { members: userId, admins: userId },
		});

		res
			.status(200)
			.json({ message: "Group request created successfully", group });
	} catch (error) {
		res.status(500).json("Cannot create group request: ", error);
	}
};

// Get group create requests
const getCreateGroupRequests = async (req, res) => {
	const userId = req.user._id;

	try {
		// Check if the user is an admin
		const user = await userModel.findById(userId);
		if (!user.admin) {
			return res
				.status(403)
				.json({ error: "Only admins can view group create requests" });
		}

		// Find all group create requests
		const groupRequests = await groupRequestModel.find({}).exec();

		res.status(200).json(groupRequests);
	} catch (error) {
		res.status(500).json("Cannot get group create requests: ", error);
	}
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

	try {
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
			return res
				.status(403)
				.json({ error: "Only admins can approve requests" });
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
	} catch (error) {
		res.status(500).json("Cannot approve join request: ", error);
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
	getOneGroup,
	getUserGroups,
	getAdminGroups,
	getGroupRequests,
	requestCreateGroup,
	approveCreateGroup,
	getCreateGroupRequests,
	requestJoinGroup,
	approveJoinGroup,
	deleteMemberFromGroup,
};
