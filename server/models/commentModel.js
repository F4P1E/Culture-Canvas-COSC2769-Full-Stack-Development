const mongoose = require("mongoose");
const { Schema } = mongoose;

const reactionSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const commentSchema = new Schema(
	{
		postId: { type: Schema.ObjectId, required: true },
		userId: { type: Schema.ObjectId, required: true },
		content: { type: String, required: true },
		reactions: {
			like: {
				type: [reactionSchema],
				validate: {
					validator: function (v) {
						return Array.isArray(v) && v.every((reaction) => reaction.user);
					},
					message: "Invalid like reactions format",
				},
			},
			love: {
				type: [reactionSchema],
				validate: {
					validator: function (v) {
						return Array.isArray(v) && v.every((reaction) => reaction.user);
					},
					message: "Invalid love reactions format",
				},
			},
			haha: {
				type: [reactionSchema],
				validate: {
					validator: function (v) {
						return Array.isArray(v) && v.every((reaction) => reaction.user);
					},
					message: "Invalid haha reactions format",
				},
			},
			angry: {
				type: [reactionSchema],
				validate: {
					validator: function (v) {
						return Array.isArray(v) && v.every((reaction) => reaction.user);
					},
					message: "Invalid angry reactions format",
				},
			},
		},
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

const Comment =
	mongoose.models.Comment || mongoose.model("Comment", commentSchema);

module.exports = Comment;
