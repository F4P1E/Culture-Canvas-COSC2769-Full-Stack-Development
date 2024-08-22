import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    postId:{
        type: String,
        require: true
    },
    userId:{
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    },
    reactions: {
        type: Map,
        of: Boolean,
    },
    reactionCount: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

export default mongoose.model('Comment', commentSchema);