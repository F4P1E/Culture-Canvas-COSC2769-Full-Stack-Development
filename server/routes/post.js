const express = require('express');
const { createPost, deletePost, updatePost, createComment, deleteComment, updateComment, reaction, commentReaction } = require('../controllers/postController');


const router = express.Router();


router.post('/', createPost);

router.delete('/:id', deletePost);   //:id is post id

router.patch('/:id', updatePost); //:id is post id

router.post('/:id/comment', createComment) //id is post id 

router.delete('/:postId/comment/:commentId', deleteComment); //comment on the post with the route parameter's id

router.patch('/:postId/comment/:commentId', updateComment); //     post/postID/comment/commentID


router.post('/:id/react', reaction); //react to post

router.post('/comment/:id/react', commentReaction); // react to comment

module.exports =  router;