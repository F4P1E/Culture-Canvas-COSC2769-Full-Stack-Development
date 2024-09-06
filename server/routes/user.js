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
	getStrangers,
	unFriend,
} = require("../controllers/userController");

// Login
router.post("/login", loginUser);

// Logout
router.get("/logout", (request, response) => {
	request.session.destroy();
	localStorage.removeItem("user", "persist:root");
	response.redirect("/");
});

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

// Get Strangers
router.get("/:id/strangers", getStrangers);

// Unfriend
router.delete("/friend/:id", unFriend);

module.exports = router;
