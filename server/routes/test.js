const express = require("express");

const { connectionTesting } = require("../controllers/testController");

const router = express.Router();

router.get("/test", connectionTesting);

module.exports = router;