const mongoose = require('mongoose');
const Expense = require("../model/expense");
const User = require("../model/users");
const s3Service = require("../services/s3Services");
const UrlFile = require("../model/uplodedFiles");
const userService = require("../services/usersServices");

exports.uploadFile = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id });
        const stringfiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense/${userId}/${new Date()}.txt`;
        const fileUrl = await s3Service.uploadFile(stringfiedExpenses, filename);
        const today = `${new Date()}`;
        const userUrl = new UrlFile({ url: fileUrl, date: today.split("G")[0],userId:req.user.id });
        await userUrl.save();
        res.status(200).json({ userUrl, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err, success: false });
    }
}

exports.getfiles = async (req, res) => {
    try {
        const files = await UrlFile.find({ userId: req.user.id });
        res.status(200).json({ files, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err, success: false });
    }
}

exports.postAddExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log(req.header("Authorization"));
        const { amount, description, category } = req.body;
        if (userService.isValidString(amount) || userService.isValidString(description) || userService.isValidString(category)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(501).json("invalid inputs");
        }

        const newExpense = new Expense({ amount, description, category, userId: req.user.id });
        await newExpense.save();

        req.user.total_expense += parseInt(amount);
        await req.user.save();

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ newExpense, success: true });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.status(502).json({ err, success: false });
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        let limitPerPage = parseInt(req.query.limit) || 5;

        const expenses = await Expense.find({ userId : req.user.id }, [], {
            limit: limitPerPage,
            skip: (page - 1) * limitPerPage,
          });

        // const expenses = await Expense.find({ userId: req.user.id })
        //     .skip((page - 1) * limitPerPage)
        //     .limit(limitPerPage);
        const totalCount = await Expense.countDocuments({ userId: req.user._id });
        console.log(expenses,req.user.id,totalCount);


        res.status(200).json({
            limit: limitPerPage,
            expenses,
            hasprevpage: page > 1,
            hasnextpage: page * limitPerPage < totalCount,
            prevpage: page - 1,
            currpage: page,
            lastpage: Math.ceil(totalCount / limitPerPage),
            nextpage: page + 1
        });

    } catch (err) {
        console.log(err);
        res.status(501).json(err);
    }
}

exports.postDeleteExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const exp = await Expense.findOne({ _id: req.params.id, userId: req.user.id }).session(session);

        if (!exp) {
            await session.abortTransaction();
            session.endSession();
            return res.status(402).json({ success: "failed", message: "expense does not belong to the user" });
        }

        req.user.total_expense -= parseInt(exp.amount);
        await req.user.save({ session });

        await Expense.deleteOne({ _id: exp._id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ deletedExpense: exp, totalExpense: req.user.total_expense });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(501).json(err);
    }
}

exports.getpremiumFeature = async (req, res, next) => {
    try {
        const users = await User.find({}, "name total_expense")
            .sort({ total_expense: -1 });

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}
