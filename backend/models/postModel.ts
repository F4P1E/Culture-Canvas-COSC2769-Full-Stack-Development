import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    content: {
        type: String || Buffer,
        required: true,
    },
    reactions: {
        type: Map,
        of: Boolean,
    },
    reactionCount: {
        type: Number,
        default: 0,
    },
    visibility: {
        type: String,
        default: "public",
    },
    commentCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);