import User, { UserToken } from '../../models/Users.js'
import Group from '../../models/Groups.js'
import checkParams from '../../utils/ubend.js'
import bcrypt from 'bcrypt'
import randomToken from 'random-token'
const saltRounds = 10;
import nodemailer from 'nodemailer'
import refreshToken from './refreshToken.js'

const auth = async (req, res) => {
    let data = req.body
    let rp = ['username', 'password', 'remember']

    var [_status, http] = checkParams(rp, data)

    var response = undefined

    if (!_status) {
        try {
            var user = await User.findOne({ where: { username: data.username } })
        } catch {
            _status = {
                'status': {
                    'code': 'E400',
                    'message': `Missing Username.`
                }
            }
            http = 400
        }
    }

    if (!user) {
        _status = {
            'status': {
                'code': 'E404',
                'message': 'Wrong Username'
            }
        }
        http = 400
    }

    if (!_status) {
        let auth = await bcrypt.compare(data.password, user.password)
        if (auth) {
            let tkn = refreshToken(user.id)
            console.log('token from controller ' + tkn)
            response = { username: data.email, token: tkn, remember: data.remember }
            response['status'] = {
                'code': 'S200',
                'message': 'User Sucessfully Authenticated.'
            }
            http = 200
        } else {
            _status = {
                'status': {
                    'code': 'E400',
                    'message': data.password ? 'Wrong Password.' : 'Missing Password'
                }
            }
            http = 400
        }
    }

    if (!_status) {
        res.json(response)
    } else {
        res.json(_status)
    }

}
const getUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users)
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
                'status': {
                    'code': 'E400',
                    'message': `User ${user.email} already registed.`
                }
            }, 400]
        }
    }

    // Hash Password
    if (!_status) {
        data['username'] = data['email']
        try {
            data['password'] = bcrypt.hashSync(data['password'], saltRounds);
        }
        catch (error) {
            _status = error
        }
    }
    if (!_status) {
        try {
            var gp = await Group.findOne({ where: { name: 'unregistered' } })
            var user = await User.build(data);
            data['token'] = randomToken(64)
            var token = await UserToken.build({ value: data['token'], type: 'confirmation' });

            await user.setGroup(gp, { save: false });

            [data['status'], http] = [{
                'status': {
                    'code': 'S200',
                    'message': 'User Sucessfully Registed.'
                }
            }, 201]

        } catch {
            [_status, http] = [{
                'status': {
                    'code': 'E400',
                    'message': 'Error with User Registration '
                }
            }, 400]
        }
    }
    if (!_status) {
        await user.save()
        await token.setUser(user, { save: false });
        await token.save()
        res.status(http).json(data)
    }

    else {
        res.status(http).json(_status)
    }
}

const sendEmail = async (req, res) => {

    let data = req.body

    let rp = [
        'to', 'token'
    ]

    var [_status, http] = checkParams(rp, data)
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
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
        to: data['to'], // list of receivers
        subject: 'Ricardo Briceño Authentication System Confirmation', // Subject line
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
}

const validateEmailToken = async (req, res) => {
    let data = req.body
    let rp = ['token']

    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        var tkn = await UserToken.findOne({ where: { value: data['token'], type: 'confirmation' } });
        if (!tkn) {
            [_status, http] = [{
                code: 'E404',
                message: 'Invalid Token.',
                token: data['token']
            }, 404]
        }
    }

    if (!_status) {
        [_status, http] = tkn['confirmation'] === true ? [{ 'code': 'E400', 'message': 'Token already validated.' }, 400] : [undefined, undefined]
    }

    if (!_status) {
        var usr = await User.findOne({ where: { id: tkn['dataValues'].userId } });
        if (!usr) {
            [_status, http] = [{
                code: 'E400',
                message: 'User not found.',
            }, 404]
        } else {
            await usr.update({ active: true });
        }
    }

    if (!_status) {
        await tkn.update({ confirmation: true });
        [data, http] = [{
            code: 'S200',
            message: `Token Validated Sucessfully.`
        }, 200]

        data['data'] = tkn['dataValues']
    }

    if (!_status) {
        res.status(http).json(data)
    } else {
        res.status(http).json(_status)
    }

}


export {
    getUsers,
    auth,
    registerUser,
    sendEmail,
    validateEmailToken
}