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
    comments: [{
        type: String,
        default: []
    }]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);