const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		postId: { type: Schema.ObjectId, required: true },
		userId: { type: Schema.ObjectId, required: true },
		content: { type: String, required: true },
		reactions: [
			{
				userId: { type: Schema.ObjectId, required: true },
				reactionType: { type: String, required: true },
			},
		],
		reactionCount: { type: Number, default: 0 },
		oldVersions: [
			{
				version: { type: Number, required: true },
				content: { type: Schema.Types.Mixed, required: true },
			},
		],
	},
	{ timestamps: true }
);

commentSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
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

module.exports = mongoose.model("Comment", commentSchema);
