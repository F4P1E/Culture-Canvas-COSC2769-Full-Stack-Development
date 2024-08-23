import express from 'express';
import { createPost, getPosts, getPostsFromSpecificUser, deletePost, updatePost, getEditHistory, createComment, deleteComment} from '../controllers/postController'


const router = express.Router();

router.get('/', getPosts);

router.post('/', createPost);

router.delete('/:id', deletePost);

router.patch('/:id', updatePost)

router.get('/:id', getPostsFromSpecificUser);

router.get('/:id/history', getEditHistory);

router.post('/comment/:id', createComment)

router.delete('/comment/:id', deleteComment);


export default router;