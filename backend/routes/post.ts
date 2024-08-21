import express from 'express';
import { createPost, getPosts, getPostsFromSpecificUser, getSinglePost, deletePost, updatePost} from '../controllers/postController'
import { error } from 'console';
import { create } from 'domain';
import requireAuth from '../middleware/requireAuth';


const router = express.Router();

router.get('/', getPosts)

router.get('/:id', getPostsFromSpecificUser)

/* router.get('/:id', getSinglePost) */

router.post('/', createPost)

router.delete('/:id', deletePost);

router.patch('/:id', updatePost)


export default router;