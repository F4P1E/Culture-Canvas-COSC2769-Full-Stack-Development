const express = require("express");

const router = express.Router();

const {
	getGroups,
	getOneGroup,
	getUserGroups,
	getGroupRequests,
	getGroupMembers,
	requestCreateGroup,
	getAdminGroups,
	requestJoinGroup,
	approveJoinGroup,
	deleteMemberFromGroup,
} = require("../controllers/groupController");

router.get("/", getGroups); // Get all groups that has not been joined

router.get("/specific/:id", getOneGroup); // Get specific group

router.get("/joined", getUserGroups); // Get groups that has been joined

router.get("/joined/admin", getAdminGroups); // Get groups that has been joined with admin privilege

router.get("/:id/requests", getGroupRequests); // Get group requests (for admins)

router.get("/:id/members", getGroupMembers); // Get group members

router.post("/request/:id", requestJoinGroup); // Send group join request

router.post("/approve/:id/:requestId", approveJoinGroup); // Add user to specific group

router.post("/", requestCreateGroup); // Create new group

router.delete("/:id/:userId", deleteMemberFromGroup); // Delete user from specific group

module.exports = router;
