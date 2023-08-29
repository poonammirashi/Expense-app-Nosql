const path = require("path");
const uuid = require("uuid");
const bcrypt = require('bcrypt');
var Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;
var apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const User = require('../model/users');
const Resetpw = require('../model/forgotPasswordRequests');

exports.forgotpage = (req, res) => {
    res.sendFile(path.join("C:/Users/Admin/Desktop/Expence tracker App html-part/forgotPassword.html"))
}

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

        const user = await User.findOne({ where: { email: email } });
        const id = uuid.v4()
        if (user) {
            const resetpassword = await Resetpw.create({ isActive: true, id, userId: user.id })
            const useremail = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'sending from node js',
                textContent: 'click to set new password',
                htmlContent: `<div><h3>Reset Password</h3></div><a href="http://localhost:3000/password/resetpassword/${id}">click here</a>`
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
    const forgetpassword = await Resetpw.findOne({ where: { id } })
    if (forgetpassword) {
        forgetpassword.update({ isActive: false })
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
        const forgetpassworduser = await Resetpw.findOne({ where: { id } });
        if (forgetpassworduser) {
            const emailuser = await User.findOne({ where: { id: forgetpassworduser.userId } });
            if (emailuser) {
                bcrypt.hash(newpassword, 10, function (err, hash) {
                    if (err) {
                        console.log(err);
                        throw new Error({ err });
                    }
                    emailuser.update({ password: hash })
                })
                
            }
        }
        res.status(200).json({ message: "password updated successfully", success: true })
    } catch (err) {
        console.log(err);
        res.status(200).json({ err, success: false })
    }
}

