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
    reactions: [{
        userId: {
            type: String,
            required: true,
        },
        reactionType: {
            type: String,
            required: true,
        },
    }],
    reactionCount: {
        type: Number,
        default: 0,
    },
    oldVersions: [{
        version: Number,
        content: Schema.Types.Mixed
    }],
}, { timestamps: true });

commentSchema.pre(['updateOne', 'findOneAndUpdate'], async function(next) {
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

export default mongoose.model('Comment', commentSchema);