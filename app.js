const express=require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

require('dotenv').config();

const path = require("path")
const cors = require('cors');

// const User = require('./model/users')
// const Expense = require("./model/expense");
// const Order = require('./model/order');
// const resetForgotPassword = require('./model/forgot-password');
// const fileUrl = require('./model/uplodedFiles');

const filestream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());
app.use(helmet.xssFilter());
app.use(morgan('combined', {stream : filestream}));
app.use(helmet.noSniff());

const userroute =require('./routes/user');
const expenseroute = require("./routes/expense");
const premiummembership = require("./routes/purchase");
const forgotPassword = require("./routes/forgot-password");

app.use(bodyparser.json({extended:false}));

app.use("/user",userroute);
app.use("/user/expense",expenseroute);
app.use("/user/purchase",premiummembership);
app.use("/password", forgotPassword);

app.use((req,res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

app.use((req,res) => {
    if(req.url === '/'){
        res.redirect('/sign-up/sign-up.html')
    }
})
// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(resetForgotPassword);
// resetForgotPassword.belongsTo(User);

// User.hasMany(fileUrl);
// fileUrl.belongsTo(User);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
 })

 const PORT = process.env.PORT_NUMBER || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
