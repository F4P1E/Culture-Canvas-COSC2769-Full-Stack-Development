const express = require("express");

const router = express.Router();

const {
	getGroups,
	getUserGroups,
	createGroup,
	requestJoinGroup,
	approveJoinGroup,
    deleteMemberFromGroup,
} = require("../controllers/groupController");

router.get("/", getGroups); // Get all groups that has not been joined

router.get("/joined", getUserGroups); // Get groups that has been joined

router.post("/request/:id", requestJoinGroup);  // Create new group

router.post("/approve/:id/:requestId", approveJoinGroup);  // Add user to specific group

router.post("/", createGroup);  // Create new group

router.delete("/:id/:userId", deleteMemberFromGroup); // Delete user from specific group

module.exports = router;
