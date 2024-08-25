import express from 'express';
import { createPost, getPosts, getPostsFromSpecificUser, deletePost, updatePost, getEditHistory, createComment, deleteComment, updateComment, getCommentsFromPost, getCommentEditHistory, reaction, commentReaction} from '../controllers/postController'


const router = express.Router();


//OLD ROUTE 
/* router.get('/', getPosts);

router.post('/', createPost);

router.delete('/:id', deletePost);   //:id is post id

router.patch('/:id', updatePost); //:id is post id

router.get('/:id', getPostsFromSpecificUser);   //:id is user id

router.get('/:id/history', getEditHistory); //id is post id

router.get('/comment/:id/history', getCommentEditHistory); //id is comment id

router.post('/:id/comment', createComment) //id is comment id 

router.delete('/:postId/comment/:commentId', deleteComment); //comment on the post with the route parameter's id

router.patch('/:postId/comment/:commentId', updateComment); //     post/postID/comment/commentID

router.get('/:id/comment', getCommentsFromPost);

router.post('/:id/react', reaction); //react to post

router.post('/comment/:id/react', commentReaction); // react to comment */


router.get('/', getPosts);

router.post('/', createPost);

router.delete('/:id', deletePost);   //:id is post id

router.patch('/:id', updatePost); //:id is post id

router.get('/user/:id', getPostsFromSpecificUser);   //:id is user id

router.get('/:id/history', getEditHistory); //id is post id

router.get('/comment/:id/history', getCommentEditHistory); //id is comment id

router.post('/:id/comment', createComment) //id is post id 

router.delete('/:id/comment/:commentId', deleteComment); //comment on the post with the route parameter's id

router.patch('/:id/comment/:commentId', updateComment); //     post/postID/comment/commentID

router.get('/:id/comment', getCommentsFromPost);

router.post('/:id/react', reaction); //react to post

router.post('/comment/:id/react', commentReaction); // react to comment

export default router;