const Razorpay = require("razorpay");
const Order = require("../model/order");
const userServices = require("../services/usersServices");

exports.premiumPurchase = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 1200;
        const order = await rzp.orders.create({ amount, currency: "INR" });

        if (!order) {
            throw new Error("Error creating order");
        }

        const premiumUser = await Order.create({ orderId: order.id, status: "Pending", userId: req.user._id });

        res.status(201).json({ success: true, order, key_id: rzp.key_id });
    } catch (err) {
        console.log(err);
        res.status(403).json({ success: false, error: err.message });
    }
};

exports.premiumPayment = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;

        const order = await Order.findOne({ orderId: order_id });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = "success";
        order.paymentId = payment_id;
        await order.save();

        req.user.isPremier = true;
        await req.user.save();

        const token = userServices.generateAccessToken(req.user.id, req.user.name, req.user.isPremier);

        res.status(202).json({ success: true, message: "Successful transaction", token });
    } catch (err) {
        console.log(err);
        res.status(404).json({ success: false, error: err.message });
    }
};

exports.premiumfails = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;

        const order = await Order.findOne({ orderId: order_id });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = "failed";
        order.paymentId = payment_id;
        await order.save();

        req.user.isPremier = false;
        await req.user.save();

        res.status(200).json({ success: true, message: "Order status updated" });
    } catch (err) {
        console.log(err);
        res.status(404).json({ success: false, error: err.message });
    }
};
