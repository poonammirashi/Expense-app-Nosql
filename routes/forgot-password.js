const express = require("express");
const fpcontroller = require("../controller/forgot-password");
const router = express.Router();

// router.get("/forgot-password", fpcontroller.forgotpage);
router.get('/updatepassword/:resetpasswordid', fpcontroller.updatepassword)

router.get('/resetpassword/:id', fpcontroller.resetpassword)

router.post("/forgot-password", fpcontroller.postForgotPassword);

module.exports = router ;