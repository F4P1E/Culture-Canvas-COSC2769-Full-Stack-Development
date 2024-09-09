const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
			type: Schema.Types.Mixed, // Allows String or Buffer
			required: true,
		},
		reactionCount: {
			type: Number,
			default: 0,
		},
		reactions: {
			like: [
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
			  },
			],
			love: [
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
			  },
			],
			haha: [
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
			  },
			],
			angry: [
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
			  },
			],
		},
		visibility: {
			type: String,
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
