const User = require('../model/users');
const path = require("path");
const bcrypt = require('bcrypt')
const userService = require("../services/usersServices");

exports.getSignUpPage = (req, res) => {
    res.sendFile(path.join("C:/Users/Admin/Desktop/Expence tracker App html-part/signUp.html"))
};

exports.postsignUpPage = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log(name)
        if (userService.isValidString(name) || userService.isValidString(email) || userService.isValidString(password)) {
            return res.status(501).json("invalid inputs")
        }
        const exUser = await User.findOne({where: {email:email}}) 
        if(exUser) {
            return res.status(504).json({message:"user already is there"})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.create({ name, email, password: hash })
            res.status(201).json({ message: "successfuly created new user" });
        })
    }
    catch (err) {
        res.json(err);
    }
}

exports.getLoginPage = (req, res) => {
    res.sendFile(path.join("C:/Users/Admin/Desktop/Expence tracker App html-part/login.html"))
}
exports.postLoginPage = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(userService.isValidString(email) || userService.isValidString(password)) {
            return res.status(405).json("invalid inputs")
        }
        const user = await User.findOne({ where: { email: email } })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    throw new Error("something went wrong");
                }
                if (result === true) {
                    return res.status(200).json({success: true,message: "user login successfull",token: userService.generateAccessToken(user.id,user.name,user.isPremier)});
                } else {
                    return res.status(401).json("User not authorized");
                }
            })
        } else {
            return res.status(402).json("User not found ");
        }
    }
    catch (err) {
        res.status(404).json("error");
    }
}  
