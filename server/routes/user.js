const express = require("express");

const router = express.Router();

// Controller functions
const {
	loginUser,
	signupUser,
	sendFriendRequest,
	cancelFriendRequest,
	acceptRequest,
	unFriend,
} = require("../controllers/userController");

// Login
router.post("/login", loginUser);

// Signup
router.post("/signup", signupUser);

// Add Friend
router.put("/addFriend", sendFriendRequest);

// Cancel Friend Request
router.put("/cancelFriend", cancelFriendRequest);

// Accept Request
router.put("/acceptRequest", acceptRequest);

// Unfriend
router.put("/unfriend", unFriend);

module.exports = router;
