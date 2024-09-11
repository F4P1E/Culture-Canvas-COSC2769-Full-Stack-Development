const connectionTesting = async (req, res) => {
	res
		.status(200)
		.json({
			status: "success",
			message: "The server is up and running, response received",
		});
};

module.exports = { connectionTesting };
