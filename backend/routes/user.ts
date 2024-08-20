import express from 'express';


const router = express.Router();

//controller function

import{ loginUser, signupUser, sendFriendRequest, cancelFriendRequest, acceptRequest, unFriend } from '../controllers/userController'

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


export default router;