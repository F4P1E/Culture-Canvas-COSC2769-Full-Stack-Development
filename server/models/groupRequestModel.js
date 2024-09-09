const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupRequestModel = new Schema(
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
		description: { type: String },
	},
	{ timestamps: true }
);

// Validation to ensure admins are members
groupRequestModel.pre("save", function (next) {
	const group = this;
	group.admins.forEach((adminId) => {
		if (!group.members.includes(adminId)) {
			const err = new Error("Admin must be a member");
			return next(err);
		}
	});
	next();
});

// Method to approve the request
groupRequestModel.methods.approveRequest = async function () {
	try {
		// After approval, the group can be created and the request can be deleted
		const Group = mongoose.model("Group");
		const newGroup = new Group({
			name: this.name,
			admins: this.admins,
			requests: this.requests,
			members: this.members,
		});
		await newGroup.save(); // Save the group

        // Add group to user
        const User = mongoose.model("User");
        const user = await User.findById(this.admins[0]);
        user.groups.push(newGroup._id);
        await user.save();

		await this.deleteOne(); // Remove the request after the group has been created
		return newGroup;
	} catch (err) {
		throw new Error("Error approving the group request: " + err.message);
	}
};

module.exports = mongoose.model("GroupRequest", groupRequestModel);
