import express from 'express';
import { createPost, getPosts, getPostsFromSpecificUser, deletePost, updatePost, createComment, deleteComment} from '../controllers/postController'
import { error } from 'console';
import { create } from 'domain';
import requireAuth from '../middleware/requireAuth';


const router = express.Router();

router.get('/', getPosts);

router.get('/:id', getPostsFromSpecificUser);

router.post('/', createPost)

router.delete('/:id', deletePost);

router.patch('/:id', updatePost)

router.put('/:id', createComment)

router.delete('/comment/:id', deleteComment);


export default router;