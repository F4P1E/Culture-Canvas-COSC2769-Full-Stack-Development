const express = require("express");

const router = express.Router();

const {
	getGroups,
	// getGroup,
    // getUserFromGroup,
	createGroup,
    addUserToGroup,
	deleteGroup,
    deleteUserFromGroup,
	updateGroup,
} = require("../controllers/groupController");

router.get("/", getGroups); // Get all groups

// router.get("/:id", getGroup);   // Get specific group

// router.get("/:id/:userId", getUserFromGroup);  // Get user from specific group

router.post("/", createGroup);  // Create new group

router.post("/:id/:userId", addUserToGroup);  // Add user to specific group

router.delete("/:id", deleteGroup); // Delete specific group

router.delete("/:id/:userId", deleteUserFromGroup); // Delete user from specific group

router.patch("/:id", updateGroup);  // Update group to reflect changes

module.exports = router;
