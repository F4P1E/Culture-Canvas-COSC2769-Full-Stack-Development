import mongoose, { Document } from "mongoose"; // Ensure to import types correctly

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
        type: Schema.Types.Mixed, // Allows String or Buffer
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
        default: 0,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    oldVersions: [{
        version: Number,
        content: Schema.Types.Mixed
    }],
}, { timestamps: true });

postSchema.pre(['updateOne', 'findOneAndUpdate'], async function(next) {
    const update: any = this.getUpdate();
    const filter: any = this.getFilter();
    const doc = await this.model.findOne(filter);

    if (doc && update.$set && update.$set.content) {
        const oldContent = doc.content;
        const version = doc.__v;
        const oldVersions = doc.oldVersions || [];

        oldVersions.push({ version, content: oldContent });
        update.$set.oldVersions = oldVersions;
    }

    next();
});

export default mongoose.model('Post', postSchema);
