const jwt = require("jsonwebtoken");
const User = require("../model/users");
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) {
            return res.status(401).json({ error: "Authorization token not provided" });
        }
        
        const userObj = jwt.verify(token, process.env.USER_TOKEN_KEY);
        
        if (!userObj) {
            throw new Error("Invalid token");
        }
        
        console.log("userid >>>>", userObj.userId);
        const user = await User.findById(userObj.userId);
        
        if (!user) {
            throw new Error("User not found");
        }
        
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
