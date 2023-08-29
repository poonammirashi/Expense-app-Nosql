const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.isValidString = (string) => {
    if (string.length === 0 || string === null) {
        return true;
    } else {
        return false;
    }
}

exports.generateAccessToken = (id,name,isPremier) => {
    return jwt.sign({userId : id, name: name, isPremier}, process.env.USER_TOKEN_KEY);
}