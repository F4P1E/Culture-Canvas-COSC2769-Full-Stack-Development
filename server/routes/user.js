const express = require("express");

const router = express.Router();

// Controller functions
const {
	loginUser,
	signupUser,
	viewFriendList,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	unFriend,
} = require("../controllers/userController");

// Login
router.post("/login", loginUser);

// Signup
router.post("/signup", signupUser);

// See friend list

router.get("/:id/friends", viewFriendList);

// Add Friend
router.post("/friend/:id", sendFriendRequest);

// Accept Request
router.post("/friendRequest/:id", acceptFriendRequest);

// Cancel Friend Request
router.delete("/friendRequest/:id", cancelFriendRequest);

// Unfriend
router.delete("/friend/:id", unFriend);

module.exports = router;
