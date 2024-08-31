const connectionTesting = async (req, res) => {
	res.status(200).json({ status: "success", data: "Connected" });
};

module.exports = { connectionTesting };
