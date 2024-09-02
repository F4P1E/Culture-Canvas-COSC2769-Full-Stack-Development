const express = require("express");

const router = express.Router();

const {
	getGroups,
	getGroup,
	createGroup,
	deleteGroup,
	updateGroup,
} = require("../controllers/groupController");

module.exports = router;
