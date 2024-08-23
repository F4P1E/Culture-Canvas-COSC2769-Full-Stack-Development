import express from 'express';
import { createPost, getPosts, getPostsFromSpecificUser, deletePost, updatePost, getEditHistory, createComment, deleteComment, updateComment, getCommentsFromPost} from '../controllers/postController'


const router = express.Router();

router.get('/', getPosts);

router.post('/', createPost);

router.delete('/:id', deletePost);

router.patch('/:id', updatePost)

router.get('/:id', getPostsFromSpecificUser);

router.get('/:id/history', getEditHistory);

router.post('/comment/:id', createComment) //comment on the post with the route parameter's id

router.delete('/:postId/comment/:commentId', deleteComment); //comment on the post with the route parameter's id

router.patch('/:postId/comment/:commentId', updateComment); //     post/postID/comment/commentID

router.get('/:id/comment', getCommentsFromPost);

export default router;