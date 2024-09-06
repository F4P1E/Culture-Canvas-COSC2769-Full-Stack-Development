const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupModel = new Schema(
    {
        name: { type: String, required: true },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Group", groupModel)