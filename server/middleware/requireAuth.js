const UserModel = require("../models/userModel");

const requireAuth = async (request, response, next) => {
	if (!request.session || !request.session._id) {
		return response
			.status(401)
			.json({ error: "You must be logged in to access this page" });
	}

	const { _id } = request.session;

	request.user = await UserModel.findOne({ _id }).select("_id");

	next();
};

module.exports = requireAuth;
