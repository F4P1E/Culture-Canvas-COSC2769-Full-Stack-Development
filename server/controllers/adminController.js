
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");  
const groupModel = require("../models/groupModel");  

const getDashboardData = async (req, res) => {
  try {
    // Fetch the total number of users
    const totalUsers = await userModel.countDocuments();
    
    // Fetch the total number of posts
    const totalPosts = await postModel.countDocuments();
    
    // Fetch the total number of groups
    const totalGroups = await groupModel.countDocuments();

    res.status(200).json({ totalUsers, totalPosts, totalGroups });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard data", error: error });
  }
};

module.exports = {
  getDashboardData,
};
