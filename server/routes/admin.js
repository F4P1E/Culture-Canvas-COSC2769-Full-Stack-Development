const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const groupController = require('../controllers/groupController');
const postController = require('../controllers/postController');

router.get('/admin/user-count', userController.getUserCount);
router.get('/admin/group-count', groupController.getGroupCount);
router.get('/admin/post-count', postController.getPostCount);

module.exports = router;
