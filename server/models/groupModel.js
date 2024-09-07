const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupModel = new Schema(
	{
		name: { type: String, required: true },
		admins: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		requests: [
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

// Validation to ensure admins are members
groupModel.pre("save", function (next) {
	const group = this;
	group.admins.forEach((adminId) => {
		if (!group.members.includes(adminId)) {
			const err = new Error("Admin must be a member");
			return next(err);
		}
	});
	next();
});

module.exports = mongoose.model("Group", groupModel);
