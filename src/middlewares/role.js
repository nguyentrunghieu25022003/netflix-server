const User = require("../models/user.model");

const checkRole = async (req, res, next) => {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    if(user.role !== "admin") {
        return res.status(500).send("Access denied !");
    }
    next();
};

module.exports = checkRole;