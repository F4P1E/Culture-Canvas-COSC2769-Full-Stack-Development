const groupModel = require("../models/groupModel");

const mongoose = require("mongoose");

// Get all groups
const getGroups = async (req, res) => {
	const groups = await groupModel.find();
	res.status(200).json(groups);
};

// Get a specific group
const getGroup = async (req, res) => {
	const { id } = req.params;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(id)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}
	const group = await groupModel.findById(id); // Find the group

	// Check if the group exists
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	res.status(200).json(group);
};

// Get user from specific group
const getUserFromGroup = async (req, res) => {
	const id = req.params.id;
	const userId = req.params.userId;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(id);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Find the user
	const user = await groupModel.findById(userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
};

// Create a new group
const createGroup = async (req, res) => {
	const { name } = req.body;

	// Check if the name is provided
	if (!name) {
		return res.status(400).json({ error: "Name is required" });
	}

	// Create the group
	const group = await groupModel.create({ name });
	res.status(200).json(group);
};

// Add user to group
const addUserToGroup = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(id);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Find the user
	const user = await groupModel.findById(userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	// Add the user to the group
	group.members.push(userId);
	await group.save();
	res.status(200).json(group);
};

// Delete group
const deleteGroup = async (req, res) => {
	const { id } = req.params;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(id)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(id);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Delete the group
	await groupModel.findByIdAndDelete(id);
	res.status(200).json({ message: "Group deleted successfully" });
};

// Delete user from group
const deleteUserFromGroup = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(id);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Find the user
	const user = await groupModel.findById(userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	// Remove the user from the group
	group.members = group.members.filter(
		(member) => member.toString() !== userId
	);
	await group.save();
	res.status(200).json({ message: "User removed from group successfully" });
};

// Update group
const updateGroup = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	// Check if the ID is valid
	if (!mongoose.isValidObjectId(id)) {
		return res.status(404).json({ error: "Incorrect ID" });
	}

	// Find the group
	const group = await groupModel.findById(id);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	// Update the group
	group.name = name;
	await group.save();
	res.status(200).json(group);
};

module.exports = {
    getGroups,
    getGroup,
    getUserFromGroup,
    createGroup,
    addUserToGroup,
    deleteGroup,
    deleteUserFromGroup,
    updateGroup
}