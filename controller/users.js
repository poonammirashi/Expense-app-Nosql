const User = require('../model/users');
const bcrypt = require('bcrypt');
const userService = require("../services/usersServices");

exports.postsignUpPage = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (userService.isValidString(name) || userService.isValidString(email) || userService.isValidString(password)) {
            return res.status(501).json("Invalid inputs");
        }

        const exUser = await User.findOne({ email });
        if (exUser) {
            return res.status(504).json({ message: "User already exists" });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ error: "Error while hashing password" });
            }

            const user = await User.create({ name, email, password: hash });
            res.status(201).json({ message: "Successfully created a new user" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.postLoginPage = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (userService.isValidString(email) || userService.isValidString(password)) {
            return res.status(405).json("Invalid inputs");
        }

        const user = await User.findOne({ email });
        console.log(user);
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Something went wrong" });
                }
                if (result === true) {
                    const token = userService.generateAccessToken(user._id, user.name, user.isPremier);
                    return res.status(200).json({ success: true, message: "User login successful", token });
                } else {
                    return res.status(401).json("User not authorized");
                }
            });
        } else {
            return res.status(402).json("User not found");
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: "Error while logging in" });
    }
};
