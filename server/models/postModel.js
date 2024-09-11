const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reactionSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const postModel = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		content: {
			type: Schema.Types.Mixed,
			required: true,
		},
		reactionCount: {
			type: Number,
			default: 0,
		},
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
		visibility: {
			type: String,
			enum: ["public", "friendsOnly", "private"],
			default: "public",
		},
		commentCount: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		oldVersions: [
			{
				version: Number,
				content: Schema.Types.Mixed,
			},
		],
	},
	{ timestamps: true }
);

postModel.pre(["updateOne", "findOneAndUpdate"], async function (next) {
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

module.exports = mongoose.model("Post", postModel);
