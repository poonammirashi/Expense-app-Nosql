const express = require("express");
const purchaseController = require("../controller/purchase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/premium-membership", authMiddleware.authenticate, purchaseController.premiumPurchase);

router.post("/premium-membership", authMiddleware.authenticate, purchaseController.premiumPayment);
router.post("/premium-membership-fail", authMiddleware.authenticate, purchaseController.premiumfails);

module.exports = router ;