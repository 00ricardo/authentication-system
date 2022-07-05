import User from '../../models/Users.js'
import checkParams from '../../utils/ubend.js'
import bcrypt from 'bcrypt'
const saltRounds = 10;
import nodemailer from 'nodemailer'

const auth = async (req, res) => {
    res.json({
        "status": {
            "code": "S200",
            "message": "User Sucessfully Authenticated."
        },
        "data": data
    })
}
const getUsers = async (req, res) => {
    //
}

const registerUser = async (req, res) => {
    let data = req.body
    let rp = [
        'first_name', 'last_name',
        'email', 'password'
    ]

    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        const user = await User.findOne({ where: { email: data['email'] } });
        if (user) {
            [_status, http] = [{
                'code': 'E400',
                'message': `User ${user["email"]} already registed.`
            }, 400]
        }
    }

    // Hash Password
    if (!_status) {
        data["username"] = data["email"]
        try {
            data["password"] = bcrypt.hashSync(data["password"], saltRounds);
        }
        catch (error) {
            _status = error
        }
    }
    if (!_status) {
        try {
            User.create(data);
            [data["status"], http] = [{
                'code': 'S200',
                'message': 'User Sucessfully Registed.'
            }, 201]

        }
        catch (error) {
            [_status, http] = [{
                'code': 'E400',
                'message': error
            }, 400]
        }
    }
    if (!_status) {
        res.status(http).json(data)
    }

    else {
        res.status(http).json(_status)
    }
}

const sendEmail = async (req, res) => {

    let data = req.body
    let rp = [
        'from', 'to',
        'subject', 'body',
        'token'
    ]

    console.log(data.token)

    var [_status, http] = checkParams(rp, data)


    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'ricardodavid120@gmail.com', // generated ethereal user
            pass: 'wczcufegehwcevos', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Ricardo Briceño Authentication System', // sender address
        to: "ricardodavid120@gmail.com", // list of receivers
        subject: "Ricardo Briceño Authentication System", // Subject line
        html: `<html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Forgot Password</title>
            <style>
                body {{'background-color: #FFFFFF; padding: 0; margin: 0;}}
            </style>
        </head>
        <body>
            <table border="0" cellpadding="0" cellspacing="10" 
                height="100%" bgcolor="#FFFFFF" width="100%" 
                style="max-width: 650px;" id="bodyTable">
                <tr>
                    <td align="center" valign="top">
                        <table border="0" cellpadding="0" cellspacing="0"
                            width="100%" id="emailContainer" 
                            style="font-family:Arial; color: #333333;">
                            <!-- Logo -->
                            <tr>
                                <td align="left" valign="top" colspan="2" 
                                    style="border-bottom: 1px solid #CCCCCC; padding-bottom: 
                                    10px;">
                                    <img alt="Authentication System Logo" border="0" src="https://i.ibb.co/YpbjC7H/logo.jpg" title="Ricardo Briceño" 
                                        class="sitelogo" width="40%" style="max-width:250px;" />
                                </td>
                            </tr>
                            <!-- Title -->
                            <tr>
                                <td align="left" valign="top" colspan="2" style="border-bottom: 1px solid 
                                    #CCCCCC; padding: 20px 0 10px 0;">
                                    <span style="font-size: 18px; font-weight: normal;">User Account Activation</span>
                                </td>
                            </tr>
                            <!-- Messages -->
                            <tr>
                                <td align="left" valign="top" colspan="2" style="padding-top: 10px;">
                                    <span style="font-size: 12px; line-height: 1.5; color: #333333;">
                                        We have sent you this email to confirm your identity 
                                        and to activate your Account.
                                        <br><br>
                                        To activate your account, please follow the link below:
                                        <a href="http://localhost:3000/confirm-email?confirmation_token=${data.token}">http://localhost:3000/confirm-email?confirmation_token=${data.token}</a>
                                        <br><br>
                                        Ricardo Briceño Authentication System
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>`
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



export {
    getUsers,
    auth,
    registerUser,
    sendEmail
}