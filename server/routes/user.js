const express = require("express");

const router = express.Router();

// Controller functions
const {
	loginUser,
	signupUser,
	getAllUsers,
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

//get All User

router.get("/user", getAllUsers);

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
