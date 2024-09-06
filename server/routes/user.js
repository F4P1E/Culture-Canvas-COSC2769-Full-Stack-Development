const express = require('express');


const router = express.Router();

//controller function
const { loginUser, signupUser, sendFriendRequest, cancelFriendRequest, acceptRequest, unFriend, getFriends, getPosts, getPostsFromSpecificUser, getEditHistory, getCommentsFromPost, getCommentEditHistory, suspendAccount } = require('../controllers/userController');



//login
router.post('/login', loginUser);

//signup
router.post('/signup', signupUser);

//addFriend

router.put('/addFriend/:id', sendFriendRequest);

//cancelFriendRequest
router.put('/cancelFriend/:id', cancelFriendRequest);

//acceptRequest
router.put('/acceptRequest/:id', acceptRequest);

//unfriend
router.put('/unfriend/:id', unFriend);


router.get('/', getPosts); 

router.get('/:id/post', getPostsFromSpecificUser);   //:id is user id   let the front end people implement the user page for this

router.get('/post/:id/history', getEditHistory); //id is post id

router.get('/comment/:id/history', getCommentEditHistory); //id is comment id

router.get('/post/:id/comment', getCommentsFromPost);  //id is post id

router.get('/friends', getFriends);


router.patch('/user/:id', suspendAccount); //id is user id


module.exports = router;