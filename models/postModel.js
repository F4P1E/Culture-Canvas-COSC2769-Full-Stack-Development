const mongoose = require('mongoose');

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
    reactionCount: {
        type: Number,
        default: 0,
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
    const update = this.getUpdate();
    const filter = this.getFilter();
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

module.exports = mongoose.model('Post', postSchema);
