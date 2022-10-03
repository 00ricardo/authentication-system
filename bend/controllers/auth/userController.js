import User, { UserToken } from '../../models/Users.js'
import Group from '../../models/Groups.js'
import checkParams, { getExtParams } from '../../utils/ubend.js'
import bcrypt from 'bcrypt'
import randomToken from 'random-token'
const saltRounds = 10;
import nodemailer from 'nodemailer'
import refreshToken from './refreshToken.js'

const auth = async (req, res) => {
    let data = req.body
    let rp = ['username', 'password',
        'remember', 'timestamp']

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

    if (!user && !_status) {
        _status = {
            'status': {
                'code': 'E404',
                'message': 'Wrong Username'
            }
        }
        http = 404
    }

    if (!_status) {
        let auth = await bcrypt.compare(data.password, user.password)
        if (auth) {
            let tkn = refreshToken(user.id)
            response = { username: data.username, token: tkn, remember: data.remember }
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
        try {
            await user.update({ last_login: new Date() })
        } catch {
            [_status, http] = [
                {
                    status: {
                        code: 'E400',
                        message: 'Last login Log Error.'
                    }
                }, 400]
        }
    }
    if (!_status) {
        res.status(http).json(response)
    } else {
        res.status(http).json(_status)
    }

}

const getUsers = async (req, res) => {
    var authheader = req.headers.authorization;
    console.log(authheader)
    const users = await User.findAll();
    res.status(200).json(users)
}

const deleteUsers = async (req, res) => {
    await User.destroy({ where: {} })
    res.status(200).json({
        status: {
            code: 'S200',
            message: 'All Users Deleted.'
        }
    })
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
            http = 400
        }
    }
    if (!_status) {
        try {
            var gp = await Group.findOne({ where: { name: 'unregistered' } })
            data['id'] = new Date().getTime()
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

const updateUser = async (req, res) => {
    let data = req.body
    const rp = ['id']
    var [_status, http] = checkParams(rp, data)
    let extp = getExtParams(rp, data)

    if (!_status) {
        try {
            var user = await User.findOne({ where: { id: data.id } })
        } catch {
            _status = {
                status: {
                    code: 'E400',
                    message: 'Missing userid.'
                }
            }
            http = 400
        }
    }

    if (!_status) {
        if (!user) {
            _status = {
                status: {
                    code: 'E404',
                    message: 'User not found.'
                }
            }
            http = 404
        }
    }

    if (!_status) {

        if (extp) {
            if (extp.includes('role')) {
                try {
                    var gp = await Group.findOne({ where: { name: data.role } })
                } catch {
                    _status = {
                        status: {
                            code: 'E400',
                            message: 'Missing gpid.'
                        }
                    }
                    http = 400
                }

                if (gp) {
                    await user.setGroup(gp, { save: true });
                } else {
                    _status = {
                        status: {
                            code: 'E404',
                            message: 'Group not found.'
                        }
                    }
                    http = 404
                }
            }

            extp.forEach(extt => {
                if (extt !== 'role') {
                    user[extt] = data[extt]
                }
            });
        }
    }

    if (!_status) {
        await user.save()
        let response = {
            status: {
                code: 'S200',
                message: 'User updated successfully.',
                data: user
            }
        }
        http = 200

        res.status(http).json(response)
    }
    else {
        res.status(http).json(_status)
    }


}

const deleteUser = async (req, res) => {
    let data = req.params
    const rp = ['userid']
    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        try {
            var user = await User.findOne({ where: { id: data.userid } })
        } catch {
            _status = {
                status: {
                    code: 'E400',
                    message: 'Missing userid.'
                }
            }
            http = 400
        }
    }

    if (!_status) {
        if (!user) {
            _status = {
                status: {
                    code: 'E404',
                    message: 'User not found.'
                }
            }
            http = 404
        }
    }

    if (!_status) {
        let response = {
            status: {
                code: 'S200',
                message: 'User deleted successfully.',
            }
        }
        http = 200

        await user.destroy()

        res.status(http).json(response)
    }
    else {
        res.status(http).json(_status)
    }
}

const sendEmail = async (req, res) => {

    let data = req.body

    let rp = [
        'to', 'token', 'type'
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

    let email = {
        from: 'Ricardo Briceño Authentication System', // sender address
        to: data['to'], // list of receivers
        subject: data['type'] === 'confirmation' ? 'Ricardo Briceño Authentication System Register Confirmation' :
            data['type'] === 'recovery' ? 'Ricardo Briceño Authentication System Password Recovery' : '',
    }

    email['html'] =
        `<html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
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
                                    <img alt="Authentication System Logo" border="0" src="https://i.ibb.co/XFfgG96/brand-logo.jpg" title="Ricardo Briceño" 
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
                                        ${data['type'] === 'confirmation'
            ? `<span style="font-size: 12px; line-height: 1.5; color: #333333;">
                    We have sent you this email to confirm your identity 
                    and to activate your Account.
                    <br><br>
                    To activate your account, please follow the link below:
                    <a href="http://localhost:3000/confirm-email?type=confirmation&token=${data.token}">http://localhost:3000/confirm-email?type=confirmation&token=${data.token}</a>
                    <br><br>
                    Ricardo Briceño Authentication System
                </span>`

            : data['type'] === 'recovery' ? `<span style="font-size: 12px; line-height: 1.5; color: #333333;">
                    We have sent you this email in response to your request
                    to reset your password on Ricardo Briceño Authentication System.
                    <br><br>
                    To reset your password, please follow the link below:
                    <a href="http://localhost:3000/confirm-email?type=recovery&token=${data.token}">http://localhost:3000/confirm-email?type=recovery&token=${data.token}</a>
                    <br><br>
                    We recommend that you keep your password secure and not share 
                    it with anyone. If you feel your password has been compromised, 
                    you can change it by going to your My Account Page 
                    and clicking on the Password Recovery link.
                    <br><br>
                    Ricardo Briceño Authentication System
                </span>` : ``}   
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>`

    try {
        // send mail with defined transport object
        await transporter.sendMail(email);
        res.status(200).json({
            status: {
                code: 'S200',
                message: 'Email sent.'
            }
        })
    } catch {
        res.status(400).json({
            status: {
                code: 'E400',
                message: 'Email not sent.'
            }
        })
    }



}

const validateEmailToken = async (req, res) => {
    let data = req.body
    let rp = ['token', 'type']
    let response = undefined

    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        var tkn = await UserToken.findOne({ where: { value: data['token'], type: data['type'] } });
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
        var usr = await User.findOne({ where: { id: tkn.userId } });
        if (!usr && type === 'confirmation') {
            [_status, http] = [{
                code: 'E400',
                message: 'User not found.',
            }, 404]
        } else {
            var gp = await Group.findOne({ where: { name: 'user' } })
            await usr.setGroup(gp, { save: false });
            await usr.update({ active: true, groupId: 2 });
        }
    }

    if (!_status) {
        if (tkn.type === 'confirmation') {
            await tkn.update({ confirmation: true });
            await usr.save();

            [response, http] = [{
                code: 'S200',
                message: `Token Validated Sucessfully.`
            }, 200]

            response['data'] = tkn['dataValues']
        } else {

            [response, http] = [{
                code: 'S200',
                message: `Wait for new password.`
            }, 200]
            response['data'] = { username: usr.username, token: data['token'] }
        }
    }

    if (!_status) {
        res.status(http).json(response)
    } else {
        res.status(http).json(_status)
    }

}

const passRecovery = async (req, res) => {
    let data = req.body
    let rp = ['username']

    var [_status, http] = checkParams(rp, data)

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

    if (!_status && !user) {
        _status = {
            'status': {
                'code': 'E404',
                'message': 'Wrong Username'
            }
        }
        http = 404
    }

    if (!_status) {
        try {
            data['token'] = randomToken(64) // Token for Pass Recovery
            var token = await UserToken.build({ value: data['token'], type: 'recovery' });
            data['status'] = {
                code: 'S201',
                message: 'Init Successfully Password Recovery Process.'
            }
            http = 201
        }
        catch {
            _status = {
                'status': {
                    'code': 'E400',
                    'message': 'Error with Pass Recovery Process.'
                }
            }
            http = 400
        }
    }

    if (!_status) {
        await token.setUser(user, { save: false });
        await token.save()
        res.status(http).json(data)
    } else {
        res.status(http).json(_status)
    }
}

const changePassword = async (req, res) => {
    let data = req.body
    let rp = ['username', 'opass', 'cpass', 'token', 'type']
    var passMatch

    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        try {
            var user = await User.findOne({ where: { username: data.username } })
        } catch {
            _status = {
                status: {
                    code: 'E400',
                    message: 'Missing Username.'
                }
            }
            http = 400
        }
    }

    if (!_status && !user) {
        _status = {
            status: {
                code: 'E404',
                message: `Wrong User.`
            }
        }
        http = 404
    }

    if (!_status) {
        if (data['opass'] !== data['cpass']) {
            _status = {
                status: {
                    code: 'E400',
                    message: "Password does't match."
                }
            }
            http = 400
        }
    }


    if (!_status) {
        try {
            passMatch = await bcrypt.compare(data.opass, user.password)
        } catch {
            _status = {
                status: {
                    code: 'E400',
                    message: 'Password cannot be empty.'
                }
            }
            http = 400
        }
        if (passMatch) {
            _status = {
                status: {
                    code: 'E400',
                    message: 'Your new password cannot be the same to your old one.'
                }
            }
            http = 400
        } else {
            try {
                data['opass'] = bcrypt.hashSync(data['opass'], saltRounds);
                data['cpass'] = data['opass']
                user.update({ password: data['opass'] })
            }
            catch (error) {
                _status = {
                    status: {
                        code: 'E400',
                        message: 'Password cannot be empty.'
                    }
                }
                http = 400
            }
        }
    }
    if (!_status) {
        await user.save()

        var tkn = await UserToken.findOne({ where: { value: data['token'], type: data['type'] } });
        await tkn.update({ confirmation: true });

        data['status'] = {
            code: 'S200',
            message: 'Password Succesfully Updated.'
        }
        http = 200
        res.status(http).json(data)

    } else {
        res.status(http).json(_status)
    }
}

const logout = async (req, res) => {
    let data = req.body
    let rp = ['username', 'token']

    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        //check if user and token exist
        var [response, http] = [{
            status: {
                code: 'S200',
                message: 'Logout'
            }
        }, http = 200]
    }

    if (!_status) {
        res.status(http).json(response)

    } else {
        res.status(http).json(_status)
    }

}

export {
    getUsers,
    auth,
    registerUser,
    sendEmail,
    validateEmailToken,
    passRecovery,
    changePassword,
    deleteUsers,
    logout,
    updateUser,
    deleteUser
}