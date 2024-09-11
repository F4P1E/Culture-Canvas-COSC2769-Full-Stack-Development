const express = require("express");

const router = express.Router();

// Controller functions
const {
	getUsers,
	suspendResumeUser,
	loginUser,
	signupUser,
	viewFriendList,
	viewFriendRequest,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	getStrangers,
	unFriend,
} = require("../controllers/userController");


// Get all users
router.get("/user", getUsers);

// Suspend user
router.patch("/suspend/:id", suspendResumeUser);

// Login
router.post("/login", loginUser);

// Logout
router.get("/logout", (request, response) => {
	request.session.destroy((err) => {
		if (err) {
			return response.status(500).send("Failed to destroy session");
		}
		response.status(200).send("Logged out successfully");
	});
});

// Signup
router.post("/signup", signupUser);

// See friend list
router.get("/:id/friends", viewFriendList);

// Add Friend
router.post("/friend/:id", sendFriendRequest);

// View request to add friend
router.get("/friendRequest", viewFriendRequest); //id is user id

// Accept Request
router.post("/friendRequest/:id", acceptFriendRequest);

// Cancel Friend Request
router.delete("/friendRequest/:id", cancelFriendRequest);

// Get Strangers
router.get("/:id/strangers", getStrangers);

// Unfriend
router.delete("/friend/:id", unFriend);

module.exports = router;
