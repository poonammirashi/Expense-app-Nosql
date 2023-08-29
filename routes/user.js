const express = require('express');
const router = express.Router();
const userController = require('../controller/users');

router.post("/sign-up", userController.postsignUpPage);

router.post("/login", userController.postLoginPage);

module.exports = router ;