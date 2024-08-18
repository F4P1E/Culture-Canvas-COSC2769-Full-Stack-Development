import express from 'express';

const router = express.Router();

//controller function

import{ loginUser, signupUser } from '../controllers/userController'

//login
router.post('/login', loginUser);


//signuo
router.post('/signup', signupUser)

export default router;