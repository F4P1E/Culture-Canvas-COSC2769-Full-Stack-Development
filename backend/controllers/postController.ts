import postModel from "../models/postModel";
import mongoose from "mongoose";

// Create new post
const createPost = async (request: any, response: any) => {
    const {username, content, reactions, reactionCount, visibility, comments} = request.body;

    let emptyFields: any[] = []

    /* if (!username) {
        emptyFields.push(username);
    } */
    if (!content) {
        emptyFields.push(content);
    }

    if (visibility && visibility !== "public" && visibility !== "friendsOnly") {
        return response.status(400).json({ error: "Invalid visibility" });
    }

    if (emptyFields.length > 0) {
        return response.status(400).json({ error: 'Please fill in all the table', emptyFields });
    }

    try {
        const userId = request.user._id 

        const post = await postModel.create({ userId, username, content, reactions, reactionCount, visibility, comments });
        response.status(200).json(post);
    } catch (error) {
        if (error instanceof Error) {
            response.status(400).json({ error: error.message });
        }
    }
}

// Get all post

const getPosts = async (request: any, response: any) => {
  try {
    const posts = await postModel.find({}).exec();
    for (let i = posts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [posts[i], posts[j]] = [posts[j], posts[i]];
    }
    response.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    response.status(500).json({ status: 'error', message: 'Failed to retrieve posts' });
  }
};

// Get all post from a user

const getPostsFromSpecificUser = async (request: any, response: any) => {
  try {
    const userId = request.params.id;
    const posts = await postModel.find({ userId }).sort({ createdAt: -1 }).exec();
    response.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    response.status(500).json({ status: 'error', message: 'Failed to retrieve posts from user' });
  }
};

// Get a single post

const getSinglePost = async (request: any, response: any) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
        response.status(404).json({ error: "Incorrect ID" });
    }
    const post = await postModel.findById(id);
    
    if (!post) {
        response.status(404).json({ error: "No such post" });
    } else {
        response.status(200).json(post);
    }
}

//Delete a post

const deletePost = async (request: any, response: any) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
        response.status(404).json({ error: "Incorrect ID" });
    }

    const post = await postModel.findOneAndDelete({ _id: id })
    
    if (!post) {
        return response.status(400).json({ error: "No such post" });
    }

    response.status(200).json(post);
    
}

//Update a post
const updatePost = async (request: any, response: any) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
        response.status(404).json({ error: "Incorrect ID" });
    }

    const post = await postModel.findOneAndUpdate({ _id: id }, {
        ...request.body
    });
    
    if (!post) {
        return response.status(400).json({ error: "No such post" });
    }

    response.status(200).json(post);
    
}

export { createPost, getPosts, getPostsFromSpecificUser, getSinglePost, deletePost, updatePost };