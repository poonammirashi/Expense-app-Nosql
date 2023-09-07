const path = require("path");
const uuid = require("uuid");
const bcrypt = require('bcrypt');
var Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;
var apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const User = require('../model/users');
const Resetpw = require('../model/forgot-password');

exports.postForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'poonick@gmail.com',
        };
        const receivers = [
            {
                email: email,
            },
        ];

        const user = await User.findOne({ email });
        const id = uuid.v4()
        if (user) {
            const resetpassword = await Resetpw.create({ isActive: true, id, userId: user.id })
            const useremail = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'sending from node js',
                textContent: 'click to set new password',
                htmlContent: `<div><h3>Reset Password</h3></div><a href="https://expense-tracker-app-o6bo.onrender.com/password/resetpassword/${id}">click here</a>`
            })
            console.log(useremail);
            res.status(200).json({ message: 'mail has been sent to users email', success: true })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err, success: false });
    }
}

exports.resetpassword = async (req, res) => {
    const id = req.params.id;
    const forgetPassword = await Resetpw.findOne({ id });
    if (forgetpassword) {
        forgetPassword.updateOne({ isActive: false });
        res.status(200).send(`<html> 
        <body>
            <form action="/password/updatepassword/${id}" method="get">
                <input type="password" name="newpassword" id="newpassword" placeholder="Enter new password" required">
                <br>
                <button type="submit" style="background-color:green">send</button>
            </form>
        <script>
            function formsubmitted(e){
            e.preventDefault();
            console.log('called')
                                       }
        </script>
        </body>
    </html>`
        )
    }
    res.end();
}

exports.updatepassword = async (req, res) => {
    try {
        const id = req.params.resetpasswordid;
        const newpassword = req.query.newpassword;
        console.log(id,newpassword)
        const forgetPasswordUser = await Resetpw.findOne({ id });
        if (forgetpassworduser) {
            const emailUser = await User.findOne({ _id: forgetPasswordUser.userId });
            if (emailUser) {
                bcrypt.hash(newpassword, 10,async function (err, hash) {
                    if (err) {
                        console.log(err);
                        throw new Error({ err });
                    }
                    await emailUser.updateOne({ password: hash });
                })
                
            }
        }
        res.status(200).json({ message: "password updated successfully", success: true })
    } catch (err) {
        console.log(err);
        res.status(200).json({ err, success: false })
    }
}