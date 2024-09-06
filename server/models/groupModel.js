const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupModel = new Schema(
	{
		name: { type: String, required: true },
		admin: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Group", groupModel);
